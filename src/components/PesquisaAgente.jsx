import { useState } from "react";
import CartaoAgente from "./CartaoAgente";
import { useDados } from "../context/DataContext";
import { ehMestre } from "../utils/regras";

// Aba "Pesquisar agente" (nível 2+): busca um agente pelo ID e mostra o cartão dele (só leitura).
const PesquisaAgente = () => {
  const { db } = useDados();
  const [id, setId] = useState("");
  const [busca, setBusca] = useState(null); // null = nada buscado | "" = não encontrado | ID achado

  const pesquisar = (e) => {
    e.preventDefault();
    const a = db.agentes.find((x) => x.id.toLowerCase() === id.trim().toLowerCase() && !ehMestre(x));
    setBusca(a ? a.id : "");
  };
  const achado = busca ? db.agentes.find((a) => a.id === busca) : null;

  return (
    <section className="pesquisa">
      <form className="tarefas-topo" onSubmit={pesquisar}>
        <label className="campo campo-inline">
          <span>ID do agente</span>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="EXP-0000" />
        </label>
        <button type="submit" className="btn btn-acento" disabled={!id.trim()}>pesquisar</button>
      </form>
      {busca === "" && <p className="aviso" role="status">Nenhum agente com esse ID.</p>}
      {achado && <CartaoAgente agente={achado} somenteLeitura />}
    </section>
  );
};

export default PesquisaAgente;
