import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { STATUS_MISSAO } from "../data/missoes";
import { useDados } from "../context/DataContext";
import { ehMestre } from "../utils/regras";
import { formatarData } from "../utils/formatar";

// Aba "Missões": "pasta" de missões do agente: começa como uma planilha (nome, status, data)
// e cada linha abre a página de detalhes da missão.
const Missoes = ({ agente }) => {
  const navigate = useNavigate();
  const { db } = useDados();
  const [filtro, setFiltro] = useState("todas");

  const minhas = db.missoes.filter((m) => ehMestre(agente) || m.agentes.includes(agente.id))
    .filter((m) => filtro === "todas" || m.status === filtro)
    .sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));

  const abrir = (id) => navigate(`/agentes/missoes/${id}`);

  return (
    <section className="missoes">
      <div className="tarefas-topo">
        <p className="contagem">
          {minhas.length} {minhas.length === 1 ? "missão" : "missões"} em seu histórico
        </p>
        <label className="campo campo-inline">
          <span>Filtrar por status</span>
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            <option value="todas">Todas</option>
            {STATUS_MISSAO.map((s) => (
              <option key={s.valor} value={s.valor}>
                {s.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="tabela-wrap">
        <table className="tabela">
          <thead>
            <tr>
              <th>Nome da missão</th>
              <th>Status</th>
              <th>Data de início</th>
            </tr>
          </thead>
          <tbody>
            {minhas.length === 0 && (
              <tr>
                <td colSpan={3} className="vazio">
                  Nenhuma missão encontrada.
                </td>
              </tr>
            )}
            {minhas.map((m) => (
              <tr
                key={m.id}
                className="clicavel"
                tabIndex={0}
                onClick={() => abrir(m.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") abrir(m.id);
                }}
              >
                <td>
                  {m.nome} <span className="codigo">{m.codigo}</span>
                </td>
                <td>
                  <StatusBadge status={m.status} />
                </td>
                <td>{formatarData(m.dataInicio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Missoes;
