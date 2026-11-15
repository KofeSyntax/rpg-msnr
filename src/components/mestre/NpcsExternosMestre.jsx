import { useState } from "react";
import Icon from "../Icon";
import CampoImagem from "../CampoImagem";
import FotoAgente from "../FotoAgente";
import { useDados } from "../../context/DataContext";
import { uid } from "../../utils/formatar";

const Campo = ({ rotulo, largo, children }) => (
  <label className={`campo ${largo ? "campo-largo" : ""}`}><span>{rotulo}</span>{children}</label>
);
const VAZIO = { id: "", nome: "", foto: "", aparencia: "", anotacoes: "" };

// Mestre: NPCs que NÃO fazem parte da Fundação (sem login). Informações básicas + anotações.
// Eles podem ser adicionados às "Relações" dos agentes. As anotações são só do Mestre.
const NpcsExternosMestre = () => {
  const { db, atualizar } = useDados();
  const [ed, setEd] = useState(null);
  const lista = db.npcsExternos || [];
  const mud = (p) => setEd((e) => ({ ...e, ...p }));

  const salvar = (e) => {
    e.preventDefault();
    if (!ed.nome.trim()) return;
    const n = { ...ed, nome: ed.nome.trim(), id: ed.id || `EXT-${uid().slice(-5).toUpperCase()}` };
    atualizar((d) => ({ npcsExternos: ed.id ? d.npcsExternos.map((x) => (x.id === ed.id ? n : x)) : [...(d.npcsExternos || []), n] }));
    setEd(null);
  };
  // remove o NPC e as relações que apontavam para ele
  const excluir = (n) => {
    if (!window.confirm(`Excluir ${n.nome}?`)) return;
    atualizar((d) => ({
      npcsExternos: d.npcsExternos.filter((x) => x.id !== n.id),
      relacoes: Object.fromEntries(Object.entries(d.relacoes || {}).map(([k, l]) => [k, l.filter((r) => r.id !== n.id)])),
    }));
  };

  return (
    <>
      <div className="tarefas-topo">
        <p className="contagem">{lista.length} NPCs externos</p>
        <button type="button" className="btn btn-acento" onClick={() => setEd(VAZIO)}><Icon nome="mais" tamanho={16} /> novo NPC externo</button>
      </div>

      {ed && (
        <form className="form-tarefa" onSubmit={salvar}>
          <Campo rotulo="Nome"><input value={ed.nome} onChange={(e) => mud({ nome: e.target.value })} /></Campo>
          <Campo rotulo="Foto"><CampoImagem valor={ed.foto} onChange={(foto) => mud({ foto })} /></Campo>
          <Campo rotulo="Aparência (os jogadores veem no cartão de relação)" largo><textarea rows={3} value={ed.aparencia} onChange={(e) => mud({ aparencia: e.target.value })} /></Campo>
          <Campo rotulo="Anotações (só o Mestre vê)" largo><textarea rows={5} value={ed.anotacoes} onChange={(e) => mud({ anotacoes: e.target.value })} /></Campo>
          <div className="campo-largo form-acoes">
            <button type="submit" className="btn btn-acento">salvar</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
          </div>
        </form>
      )}

      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Foto</th><th>NPC</th><th>Aparência</th><th>Ações</th></tr></thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={4} className="vazio">Nenhum NPC externo.</td></tr>}
            {lista.map((n) => (
              <tr key={n.id}>
                <td style={{ width: 70 }}><FotoAgente src={n.foto} nome={n.nome} /></td>
                <td>{n.nome} <span className="codigo">{n.id}</span></td>
                <td>{n.aparencia || "—"}</td>
                <td className="acoes-linha">
                  <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setEd({ ...VAZIO, ...n })}>editar</button>
                  <button type="button" className="icone-btn" aria-label={`Excluir ${n.nome}`} onClick={() => excluir(n)}><Icon nome="lixeira" tamanho={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default NpcsExternosMestre;
