import { useState } from "react";
import Icon from "../Icon";
import CampoImagem from "../CampoImagem";
import FotoAgente from "../FotoAgente";
import { useDados } from "../../context/DataContext";
import { ATRIBUTOS } from "../../data/ficha";
import { uid } from "../../utils/formatar";

const Campo = ({ rotulo, largo, children }) => (
  <label className={`campo ${largo ? "campo-largo" : ""}`}><span>{rotulo}</span>{children}</label>
);

const VAZIA = {
  id: "", nome: "", nivel: 1, foto: "",
  atributos: Object.fromEntries(ATRIBUTOS.map((a) => [a.id, 1])),
  ataques: [], habilidades: [], armas: [], inventario: [], anotacoes: "",
};

// Lista editável genérica: campos = [{ k, ph, tipo? }]; classe = layout da linha (ver index.css)
const ListaEdit = ({ titulo, itens, campos, classe, vazio, onChange }) => {
  const mud = (i, k, v) => onChange(itens.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  return (
    <div className="campo-largo">
      <h3 className="ficha-sub">{titulo}</h3>
      <div className="lista-edit">
        {itens.map((it, i) => (
          <div key={i} className={`linha ${classe}`}>
            {campos.map((c) => (
              <input key={c.k} type={c.tipo || "text"} min={c.tipo ? 0 : undefined} placeholder={c.ph} value={it[c.k] ?? ""}
                onChange={(e) => mud(i, c.k, c.tipo ? Math.max(0, +e.target.value) : e.target.value)} />
            ))}
            <button type="button" className="icone-btn" aria-label={`Remover de ${titulo}`} onClick={() => onChange(itens.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-fantasma btn-mini" onClick={() => onChange([...itens, { ...vazio }])}>+ adicionar</button>
    </div>
  );
};

// Mestre: banco de criaturas (nome e nível na lista; ao abrir, ficha completa da criatura).
const CriaturasMestre = () => {
  const { db, atualizar } = useDados();
  const [ed, setEd] = useState(null);
  const [busca, setBusca] = useState("");
  const lista = (db.criaturas || []).filter((c) => c.nome.toLowerCase().includes(busca.trim().toLowerCase()));
  const mud = (p) => setEd((e) => ({ ...e, ...p }));

  const salvar = (e) => {
    e.preventDefault();
    if (!ed.nome.trim()) return;
    const c = { ...ed, nome: ed.nome.trim(), nivel: +ed.nivel || 1, id: ed.id || uid() };
    atualizar((d) => ({ criaturas: ed.id ? d.criaturas.map((x) => (x.id === ed.id ? c : x)) : [...(d.criaturas || []), c] }));
    setEd(null);
  };
  const excluir = (c) => window.confirm(`Excluir ${c.nome}?`) && atualizar((d) => ({ criaturas: d.criaturas.filter((x) => x.id !== c.id) }));

  if (ed) {
    return (
      <form className="form-tarefa" onSubmit={salvar}>
        <Campo rotulo="Nome"><input value={ed.nome} onChange={(e) => mud({ nome: e.target.value })} /></Campo>
        <Campo rotulo="Nível"><input type="number" min="0" value={ed.nivel} onChange={(e) => mud({ nivel: e.target.value })} /></Campo>
        <Campo rotulo="Imagem" largo><CampoImagem valor={ed.foto} onChange={(foto) => mud({ foto })} /></Campo>

        <div className="campo-largo">
          <h3 className="ficha-sub">Atributos</h3>
          <div className="atrib-criatura">
            {ATRIBUTOS.map((a) => (
              <Campo key={a.id} rotulo={a.nome}>
                <input type="number" min="0" value={ed.atributos?.[a.id] ?? 0} onChange={(e) => mud({ atributos: { ...ed.atributos, [a.id]: Math.max(0, +e.target.value) } })} />
              </Campo>
            ))}
          </div>
        </div>

        <ListaEdit titulo="Ataques" classe="" itens={ed.ataques} vazio={{ nome: "", teste: "", dano: "" }} onChange={(ataques) => mud({ ataques })}
          campos={[{ k: "nome", ph: "Ataque" }, { k: "teste", ph: "Teste (1d20+4)" }, { k: "dano", ph: "Dano (2d6)" }]} />
        <ListaEdit titulo="Habilidades" classe="habil" itens={ed.habilidades} vazio={{ nome: "", descricao: "", custo: 0 }} onChange={(habilidades) => mud({ habilidades })}
          campos={[{ k: "nome", ph: "Nome" }, { k: "descricao", ph: "Descrição" }, { k: "custo", ph: "EN", tipo: "number" }]} />
        <ListaEdit titulo="Armas" classe="dois" itens={ed.armas} vazio={{ nome: "", descricao: "" }} onChange={(armas) => mud({ armas })}
          campos={[{ k: "nome", ph: "Arma" }, { k: "descricao", ph: "Dano / descrição" }]} />
        <ListaEdit titulo="Inventário" classe="um" itens={ed.inventario} vazio={{ nome: "" }} onChange={(inventario) => mud({ inventario })}
          campos={[{ k: "nome", ph: "Item" }]} />

        <Campo rotulo="Anotações" largo><textarea rows={5} value={ed.anotacoes} onChange={(e) => mud({ anotacoes: e.target.value })} /></Campo>
        <div className="campo-largo form-acoes">
          <button type="submit" className="btn btn-acento">salvar criatura</button>
          <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
        </div>
      </form>
    );
  }

  return (
    <>
      <div className="tarefas-topo">
        <p className="contagem">{lista.length} {lista.length === 1 ? "criatura" : "criaturas"}</p>
        <div className="filtros">
          <label className="campo campo-inline"><span>Buscar</span><input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="nome" /></label>
          <button type="button" className="btn btn-acento" onClick={() => setEd(VAZIA)}><Icon nome="mais" tamanho={16} /> nova criatura</button>
        </div>
      </div>
      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Imagem</th><th>Criatura</th><th>Nível</th><th>Ações</th></tr></thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={4} className="vazio">Nenhuma criatura cadastrada.</td></tr>}
            {lista.map((c) => (
              <tr key={c.id}>
                <td style={{ width: 70 }}><FotoAgente src={c.foto} nome={c.nome} /></td>
                <td>{c.nome}</td>
                <td>{c.nivel}</td>
                <td className="acoes-linha">
                  <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setEd({ ...VAZIA, ...c, atributos: { ...VAZIA.atributos, ...c.atributos } })}>abrir / editar</button>
                  <button type="button" className="icone-btn" aria-label={`Excluir ${c.nome}`} onClick={() => excluir(c)}><Icon nome="lixeira" tamanho={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CriaturasMestre;
