import { useState } from "react";
import Icon from "./Icon";
import { useDados } from "../context/DataContext";
import { formatarHora, uid } from "../utils/formatar";

const VAZIA = { id: null, titulo: "", texto: "" };

// Aba "Anotações": quantas o agente quiser; só ficam salvas ao clicar em "salvar".
const Anotacoes = ({ agente }) => {
  const { db, atualizar } = useDados();
  const notas = db.notas[agente.id] || [];
  const [ed, setEd] = useState(null);

  const gravar = (fn) => atualizar((d) => ({ notas: { ...d.notas, [agente.id]: fn(d.notas[agente.id] || []) } }));

  const salvar = (e) => {
    e.preventDefault();
    if (!ed.titulo.trim() && !ed.texto.trim()) return;
    const n = { id: ed.id || uid(), titulo: ed.titulo.trim() || "Sem título", texto: ed.texto, data: new Date().toISOString() };
    gravar((l) => (ed.id ? l.map((x) => (x.id === ed.id ? n : x)) : [n, ...l]));
    setEd(null);
  };

  return (
    <section className="notas">
      <div className="tarefas-topo">
        <p className="contagem">{notas.length} {notas.length === 1 ? "anotação" : "anotações"}</p>
        {!ed && (
          <button type="button" className="btn btn-acento" onClick={() => setEd(VAZIA)}>
            <Icon nome="mais" tamanho={16} /> nova anotação
          </button>
        )}
      </div>

      {ed && (
        <form className="form-tarefa" onSubmit={salvar}>
          <label className="campo campo-largo">
            <span>Título</span>
            <input value={ed.titulo} maxLength={80} onChange={(e) => setEd({ ...ed, titulo: e.target.value })} />
          </label>
          <label className="campo campo-largo">
            <span>Anotação</span>
            <textarea rows={6} value={ed.texto} onChange={(e) => setEd({ ...ed, texto: e.target.value })} />
          </label>
          <div className="campo-largo form-acoes">
            <button type="submit" className="btn btn-acento">salvar</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
          </div>
        </form>
      )}

      {notas.length === 0 && !ed && <p className="vazio">Nenhuma anotação ainda.</p>}
      <div className="grade-notas">
        {notas.map((n) => (
          <article key={n.id} className="nota">
            <h4>{n.titulo}</h4>
            <p className="nota-texto">{n.texto}</p>
            <div className="nota-rodape">
              <span className="codigo">{formatarHora(n.data)}</span>
              <span>
                <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setEd(n)}>editar</button>
                <button type="button" className="icone-btn" aria-label="Excluir anotação" onClick={() => gravar((l) => l.filter((x) => x.id !== n.id))}>
                  <Icon nome="lixeira" tamanho={16} />
                </button>
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Anotacoes;
