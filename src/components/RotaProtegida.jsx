import { Navigate } from "react-router-dom";
import Icon from "./Icon";
import { useAuth } from "../context/AuthContext";
import { ehMestre } from "../utils/regras";

// Envolve uma página que exige login (e, opcionalmente, um nível mínimo).
// Uso: <RotaProtegida nivelMinimo={2}><MinhaPagina /></RotaProtegida>
const RotaProtegida = ({ children, nivelMinimo = 0, somenteMestre = false }) => {
  const { logado, agente } = useAuth();

  if (!logado) return <Navigate to="/agentes" replace />;

  if (somenteMestre && !ehMestre(agente)) {
    return (
      <section className="pagina">
        <p className="aviso">
          <Icon nome="alerta" tamanho={16} /> Acesso negado: área exclusiva do Mestre.
        </p>
      </section>
    );
  }

  if (agente.nivel < nivelMinimo) {
    return (
      <section className="pagina">
        <p className="aviso">
          <Icon nome="alerta" tamanho={16} /> Acesso negado: esta página exige nível{" "}
          {nivelMinimo}. Seu nível: {agente.nivel}.
        </p>
      </section>
    );
  }

  return children;
};

export default RotaProtegida;
