import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { useAuth } from "../context/AuthContext";
import { useDados } from "../context/DataContext";
import { CONTENCAO } from "../data/entidades";
import { ehMestre } from "../utils/regras";

const SeloContencao = ({ valor }) => {
  const c = CONTENCAO.find((x) => x.valor === valor);
  return <span className="selo-contencao" style={{ "--cor": c?.cor }}>{c ? c.rotulo : valor}</span>;
};

// Rota: /entidades (nível 1+). Cada entidade só aparece para quem tem o nível exigido por ela.
const Entidades = () => {
  const { agente } = useAuth();
  const { db } = useDados();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todas");

  const termo = busca.trim().toLowerCase().replace(/^id-/, "");
  const visiveis = db.entidades.filter((e) => ehMestre(agente) || agente.nivel >= e.nivel);
  const itens = visiveis
    .filter((e) => filtro === "todas" || e.contencao === filtro)
    .filter((e) => !termo || e.nome.toLowerCase().includes(termo) || e.id.toLowerCase().includes(termo));

  const abrir = (id) => navigate(`/entidades/${id}`);

  return (
    <>
      <Banner compacto />
      <section className="pagina">
        <h1 className="titulo-pagina">Entidades</h1>
        <p className="intro">Registros arquivados da Fundação. Você vê apenas as entidades liberadas para o seu nível de acesso.</p>

        <div className="tarefas-topo">
          <p className="contagem">{itens.length} {itens.length === 1 ? "entidade" : "entidades"}</p>
          <div className="filtros">
            <label className="campo campo-inline">
              <span>Buscar</span>
              <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="nome ou ID" />
            </label>
            <label className="campo campo-inline">
              <span>Contenção</span>
              <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
                <option value="todas">Todas</option>
                {CONTENCAO.map((c) => <option key={c.valor} value={c.valor}>{c.rotulo}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="tabela-wrap">
          <table className="tabela">
            <thead><tr><th>Nome</th><th>ID</th><th>Contenção</th><th>Nível</th></tr></thead>
            <tbody>
              {itens.length === 0 && <tr><td colSpan={4} className="vazio">Nenhuma entidade encontrada.</td></tr>}
              {itens.map((e) => (
                <tr key={e.id} className="clicavel" tabIndex={0} onClick={() => abrir(e.id)} onKeyDown={(ev) => { if (ev.key === "Enter") abrir(e.id); }}>
                  <td>{e.nome}</td>
                  <td className="codigo">ID-{e.id}</td>
                  <td><SeloContencao valor={e.contencao} /></td>
                  <td>{e.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default Entidades;
