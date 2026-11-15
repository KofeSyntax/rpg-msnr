import { useState } from "react";
import FotoAgente from "./FotoAgente";
import { useDados } from "../context/DataContext";
import { ehMestre } from "../utils/regras";

const NIVEIS_CONEXAO = 3; // quantidade de círculos

// Aba "Relações": cartões de agentes e NPCs com o nome em cima e 3 círculos embaixo.
// Cada círculo pintado (gradiente) soma 1 ponto de "conexão".
// Só o Mestre edita (editavel): jogadores apenas veem. Clique no círculo para definir o nível;
// clicar de novo no último círculo pintado diminui um nível.
const Relacoes = ({ agente, editavel = false }) => {
  const { db, atualizar } = useDados();
  const [novo, setNovo] = useState("");
  const lista = db.relacoes?.[agente.id] || [];
  const externos = db.npcsExternos || [];

  const gravar = (fn) =>
    atualizar((d) => ({ relacoes: { ...d.relacoes, [agente.id]: fn(d.relacoes?.[agente.id] || []) } }));

  // quem aparece no cartão: agente/NPC da Fundação ou NPC externo
  const achar = (id) => db.agentes.find((a) => a.id === id) || externos.find((n) => n.id === id);
  const disponiveis = [
    ...db.agentes.filter((a) => a.id !== agente.id && !ehMestre(a)).map((a) => ({ id: a.id, rotulo: `${a.nome} (${a.id})` })),
    ...externos.map((n) => ({ id: n.id, rotulo: `${n.nome} (NPC externo)` })),
  ].filter((o) => !lista.some((r) => r.id === o.id));

  const adicionar = (e) => {
    e.preventDefault();
    if (!novo) return;
    gravar((l) => [...l, { id: novo, nivel: 0 }]);
    setNovo("");
  };
  const definirNivel = (id, n) =>
    gravar((l) => l.map((r) => (r.id === id ? { ...r, nivel: r.nivel === n ? n - 1 : n } : r)));
  const remover = (id) => gravar((l) => l.filter((r) => r.id !== id));

  return (
    <section className="relacoes">
      <div className="tarefas-topo">
        <p className="contagem">{lista.length} {lista.length === 1 ? "relação" : "relações"}</p>
        {editavel && (
          <form className="filtros" onSubmit={adicionar}>
            <label className="campo campo-inline">
              <span>Agente / NPC</span>
              <select value={novo} onChange={(e) => setNovo(e.target.value)}>
                <option value="">Escolher…</option>
                {disponiveis.map((o) => <option key={o.id} value={o.id}>{o.rotulo}</option>)}
              </select>
            </label>
            <button type="submit" className="btn btn-acento" disabled={!novo}>adicionar</button>
          </form>
        )}
      </div>

      {lista.length === 0 && (
        <p className="vazio">Nenhuma relação registrada{editavel ? " ainda." : ". As relações são definidas pelo Mestre."}</p>
      )}
      <div className="grade-relacoes">
        {lista.map((r) => {
          const a = achar(r.id);
          if (!a) return null;
          return (
            <article key={r.id} className="relacao">
              <h3 className="relacao-nome">{a.nome}</h3>
              <FotoAgente src={a.foto} nome={a.nome} />
              {a.aparencia && <p className="relacao-desc">{a.aparencia}</p>}
              <div className="relacao-circulos" role="group" aria-label={`Conexão com ${a.nome}: ${r.nivel} de ${NIVEIS_CONEXAO}`}>
                {Array.from({ length: NIVEIS_CONEXAO }, (_, i) => {
                  const cls = `circulo ${i < r.nivel ? "cheio" : ""}`;
                  return editavel ? (
                    <button key={i} type="button" className={cls} aria-pressed={i < r.nivel} aria-label={`Nível de conexão ${i + 1}`} onClick={() => definirNivel(r.id, i + 1)} />
                  ) : (
                    <span key={i} className={`${cls} leitura`} />
                  );
                })}
              </div>
              {editavel && <button type="button" className="btn btn-fantasma btn-mini" onClick={() => remover(r.id)}>remover</button>}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Relacoes;
