import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDados } from "../context/DataContext";
import { AMEACAS, STATUS_BANCO } from "../data/banco";
import { formatarData } from "../utils/formatar";

// Aba "Banco de Dados": lista de arquivos liberados ao nível do agente (nível 0 não vê nada).
// Busca por código, nome ou local; filtros de ameaça, status e período. Cada linha abre o arquivo.
const BancoDados = ({ agente }) => {
  const navigate = useNavigate();
  const { db } = useDados();
  const [busca, setBusca] = useState("");
  const [ameaca, setAmeaca] = useState("todas");
  const [status, setStatus] = useState("todos");
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  const termo = busca.trim().toLowerCase();
  const itens = db.banco
    .filter((e) => agente.nivel >= 1 && agente.nivel >= e.nivel)
    .filter((e) => !termo || [e.codigo, e.designacao, e.local].join(" ").toLowerCase().includes(termo))
    .filter((e) => ameaca === "todas" || e.ameaca === ameaca)
    .filter((e) => status === "todos" || e.status === status)
    .filter((e) => (!de || e.data >= de) && (!ate || e.data <= ate))
    .sort((a, b) => b.data.localeCompare(a.data));

  const abrir = (id) => navigate(`/agentes/banco/${id}`);
  const Filtro = ({ rotulo, valor, aoMudar, opcoes, todos }) => (
    <label className="campo campo-inline">
      <span>{rotulo}</span>
      <select value={valor} onChange={(e) => aoMudar(e.target.value)}>
        <option value={todos}>{todos === "todas" ? "Todas" : "Todos"}</option>
        {opcoes.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );

  return (
    <section className="banco">
      <div className="tarefas-topo">
        <p className="contagem">{itens.length} {itens.length === 1 ? "arquivo" : "arquivos"} liberados</p>
        <div className="filtros">
          <label className="campo campo-inline">
            <span>Buscar</span>
            <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="código, nome, local" />
          </label>
          <Filtro rotulo="Ameaça" valor={ameaca} aoMudar={setAmeaca} opcoes={AMEACAS} todos="todas" />
          <Filtro rotulo="Status" valor={status} aoMudar={setStatus} opcoes={STATUS_BANCO} todos="todos" />
          <label className="campo campo-inline"><span>De</span><input type="date" value={de} onChange={(e) => setDe(e.target.value)} /></label>
          <label className="campo campo-inline"><span>Até</span><input type="date" value={ate} onChange={(e) => setAte(e.target.value)} /></label>
        </div>
      </div>

      <div className="tabela-wrap">
        <table className="tabela">
          <thead>
            <tr><th>Código</th><th>Designação</th><th>Local</th><th>Ameaça</th><th>Status</th><th>Data</th></tr>
          </thead>
          <tbody>
            {itens.length === 0 && (
              <tr><td colSpan={6} className="vazio">{agente.nivel < 1 ? "Seu nível não tem acesso ao banco de dados." : "Nenhum arquivo encontrado."}</td></tr>
            )}
            {itens.map((e) => (
              <tr key={e.id} className="clicavel" tabIndex={0} onClick={() => abrir(e.id)} onKeyDown={(ev) => ev.key === "Enter" && abrir(e.id)}>
                <td className="codigo">{e.codigo}</td>
                <td>{e.designacao}</td>
                <td>{e.local}</td>
                <td>{e.ameaca}</td>
                <td>{e.status}</td>
                <td>{formatarData(e.data)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default BancoDados;
