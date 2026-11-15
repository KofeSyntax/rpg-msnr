import { useState } from "react";
import Icon from "../Icon";
import { useDados } from "../../context/DataContext";
import { TIPOS_CATALOGO } from "../../data/itens";
import { ATRIBUTOS } from "../../data/ficha";
import { uid } from "../../utils/formatar";

const Campo = ({ rotulo, largo, children }) => (
  <label className={`campo ${largo ? "campo-largo" : ""}`}><span>{rotulo}</span>{children}</label>
);

// Mestre: edita o catálogo de armas e itens básicos que os agentes podem adicionar à ficha.
const CatalogoMestre = () => {
  const { db, atualizar } = useDados();
  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState("");
  const mudar = (id, p) => atualizar((d) => ({ catalogo: d.catalogo.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  const texto = (c, k) => <input value={c[k] ?? ""} onChange={(e) => mudar(c.id, { [k]: e.target.value })} />;
  const lista = db.catalogo.filter((c) => (!tipo || c.tipo === tipo) && c.nome.toLowerCase().includes(busca.trim().toLowerCase()));
  return (
    <>
      <p className="intro">Itens que os agentes podem adicionar à ficha pelo botão "Do catálogo". Alterar o catálogo não muda fichas que já têm o item.</p>
      <div className="form-tarefa">
        <Campo rotulo="Buscar"><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="nome do item" /></Campo>
        <Campo rotulo="Tipo">
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos</option>
            {TIPOS_CATALOGO.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
          </select>
        </Campo>
      </div>
      {lista.length === 0 && <p className="vazio">Nenhum item encontrado.</p>}
      {lista.map((c) => (
        <details key={c.id} className="catalogo-det" open={c.nome === "Novo item"}>
          <summary><b>{c.nome || "(sem nome)"}</b> <span className="codigo">{c.tipo} · nível {c.nivel ?? "-"}</span></summary>
          <div className="form-tarefa">
            <Campo rotulo="Nome">{texto(c, "nome")}</Campo>
            <Campo rotulo="Tipo">
              <select value={c.tipo} onChange={(e) => mudar(c.id, { tipo: e.target.value })}>
                {TIPOS_CATALOGO.map(([v, r]) => <option key={v} value={v}>{r}</option>)}
              </select>
            </Campo>
            <Campo rotulo="Nível (vazio = -)"><input type="number" min="0" value={c.nivel ?? ""} onChange={(e) => mudar(c.id, { nivel: e.target.value === "" ? null : +e.target.value })} /></Campo>
            <Campo rotulo="Dano (ex.: 1d8)">{texto(c, "dano")}</Campo>
            <Campo rotulo="Crítico (ex.: 19/x3)">{texto(c, "critico")}</Campo>
            <Campo rotulo="Alcance">{texto(c, "alcance")}</Campo>
            <Campo rotulo="Munição (armazenamento)">{texto(c, "municao")}</Campo>
            <Campo rotulo="Usos">{texto(c, "usos")}</Campo>
            <Campo rotulo="Espaço"><input type="number" min="0" value={c.espaco ?? 1} onChange={(e) => mudar(c.id, { espaco: +e.target.value })} /></Campo>
            <Campo rotulo={c.tipo === "mochila" ? "Espaços da mochila" : "Bônus de espaço ao equipar"}><input type="number" min="0" value={c.bonusEspaco ?? 0} onChange={(e) => mudar(c.id, { bonusEspaco: +e.target.value })} /></Campo>
            {c.tipo === "mochila" && ATRIBUTOS.map((at) => (
              <Campo key={at.id} rotulo={`Penalidade em ${at.nome} (perícias)`}>
                <input type="number" min="0" value={c.penalidades?.[at.id] ?? 0} onChange={(e) => mudar(c.id, { penalidades: { ...c.penalidades, [at.id]: Math.max(0, +e.target.value) } })} />
              </Campo>
            ))}
            <Campo rotulo="Descrição" largo><textarea rows={2} value={c.descricao ?? ""} onChange={(e) => mudar(c.id, { descricao: e.target.value })} /></Campo>
            <div className="campo-largo">
              <button type="button" className="btn btn-fantasma btn-mini" onClick={() => window.confirm(`Excluir "${c.nome}" do catálogo?`) && atualizar((d) => ({ catalogo: d.catalogo.filter((x) => x.id !== c.id) }))}>
                <Icon nome="lixeira" tamanho={14} /> excluir do catálogo
              </button>
            </div>
          </div>
        </details>
      ))}
      <button type="button" className="btn btn-acento" onClick={() => { setBusca(""); setTipo(""); atualizar((d) => ({ catalogo: [...d.catalogo, { id: uid(), tipo: "item", nome: "Novo item", nivel: 0, dano: "", critico: "", alcance: "", municao: "", usos: "", espaco: 1, bonusEspaco: 0, descricao: "" }] })); }}>
        <Icon nome="mais" tamanho={16} /> novo item no catálogo
      </button>
    </>
  );
};

export default CatalogoMestre;
