import { Link, NavLink, useNavigate } from "react-router-dom";
import Icon from "./Icon";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { SITE } from "../data/site";
import { useDados } from "../context/DataContext";
import { ehMestre } from "../utils/regras";

const Navbar = () => {
  const navigate = useNavigate();
  const { agente, logout } = useAuth();
  const { db } = useDados();
  const ativo = ({ isActive }) => (isActive ? "ativo" : undefined);
  const pedidos = agente ? db.amizades.filter((x) => x.para === agente.id && x.status === "pendente").length : 0;

  // "Sobre" e "Contratos" são seções da Home: vai para "/" e rola até elas.
  const irParaSecao = (evento, secao) => {
    evento.preventDefault();
    navigate("/", { state: { secao } });
  };

  const sair = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="menu">
      <div className="menu-nav">
        <Link to="/" id="empresa" className="menu-marca">
          <h1>{SITE.sigla}</h1>
          <h5>{SITE.nomeCompleto}</h5>
        </Link>

        <div id="links" className="menu-links">
          {agente && (
            <a href="/#sobre" onClick={(e) => irParaSecao(e, "sobre")}>
              Sobre
            </a>
          )}
          <a href="/#contratos" onClick={(e) => irParaSecao(e, "contratos")}>
            Contratos
          </a>
          <NavLink
            id="cadastro"
            to="/agentes"
            className={({ isActive }) => (isActive ? "ativo" : undefined)}
          >
            Agentes
          </NavLink>

          {agente && (
            <>
              <NavLink to="/corporacao" className={ativo}>
                Corporação
              </NavLink>
              {agente.nivel >= 1 && (
                <NavLink to="/entidades" className={ativo}>
                  Entidades
                </NavLink>
              )}
              <NavLink to="/mensagens" className={ativo}>
                Mensagens
                {pedidos > 0 && <span className="selo-nav" title="Pedidos de amizade">{pedidos}</span>}
              </NavLink>
              {ehMestre(agente) && (
                <NavLink to="/mestre" className={ativo}>
                  Mestre
                </NavLink>
              )}
            </>
          )}

          {agente && (
            <span className="menu-usuario">
              <Icon nome="usuario" tamanho={16} />
              {agente.id}
              <button
                type="button"
                className="icone-btn"
                onClick={sair}
                aria-label="Sair"
                title="Sair"
              >
                <Icon nome="sair" tamanho={16} />
              </button>
            </span>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
