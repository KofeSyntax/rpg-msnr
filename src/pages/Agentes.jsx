import { useState } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import Icon from "../components/Icon";
import LoginForm from "../components/LoginForm";
import CartaoAgente from "../components/CartaoAgente";
import FichaAgente from "../components/FichaAgente";
import Anotacoes from "../components/Anotacoes";
import Missoes from "../components/Missoes";
import Documentos from "../components/Documentos";
import BancoDados from "../components/BancoDados";
import PesquisaAgente from "../components/PesquisaAgente";
import { useAuth } from "../context/AuthContext";
import { ABAS } from "../data/abas";
import { ehNpc } from "../utils/regras";

const Agentes = () => {
  const { logado, agente } = useAuth();
  const location = useLocation();
  const [abaAtiva, setAbaAtiva] = useState(location.state?.aba || "");
  const [abaNegada, setAbaNegada] = useState(null);

  // ---- Sem login: pede identificação ----
  if (!logado) {
    return (
      <>
        <Banner compacto />
        <section className="pagina login-pagina">
          <div className="aviso-login">
            <Icon nome="cadeado" tamanho={40} />
            <h1 className="titulo-pagina">Agentes</h1>
            <p>Área restrita. Identifique-se com seu ID e senha para continuar.</p>
          </div>
          <LoginForm />
        </section>
      </>
    );
  }

  // ---- Logado ----
  // NPC não tem a aba Ficha
  const abas = ABAS.filter((a) => !(a.somenteJogador && ehNpc(agente)));
  const abaDef = abas.find((a) => a.id === abaAtiva);
  // Se a aba pedida não existir ou o nível não alcançar, abre a primeira aba
  const abaValida = abaDef && agente.nivel >= abaDef.nivelMinimo ? abaAtiva : abas[0].id;

  const escolherAba = (aba) => {
    if (agente.nivel < aba.nivelMinimo) {
      setAbaNegada(aba);
      return;
    }
    setAbaNegada(null);
    setAbaAtiva(aba.id);
  };

  const renderAba = () => {
    switch (abaValida) {
      case "anotacoes":
        return <Anotacoes agente={agente} />;
      case "missoes":
        return <Missoes agente={agente} />;
      case "arquivos":
        return <Documentos agente={agente} />;
      case "banco":
        return <BancoDados agente={agente} />;
      case "pesquisa":
        return <PesquisaAgente />;
      default:
        return <FichaAgente key={agente.id} agente={agente} />;
    }
  };

  return (
    <>
      <Banner compacto />
      <section className="pagina">
        <h1 className="titulo-pagina">Agentes</h1>

        <CartaoAgente agente={agente} />

        <div className="abas" role="tablist">
          {abas.map((aba) => {
            const liberada = agente.nivel >= aba.nivelMinimo;
            const classes = ["aba", aba.id === abaValida ? "ativa" : "", liberada ? "" : "bloqueada"]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={aba.id}
                type="button"
                role="tab"
                aria-selected={aba.id === abaValida}
                className={classes}
                onClick={() => escolherAba(aba)}
                title={liberada ? aba.rotulo : `Exige nível ${aba.nivelMinimo}`}
              >
                {!liberada && <Icon nome="cadeado" tamanho={14} />}
                {aba.rotulo}
              </button>
            );
          })}
        </div>

        {abaNegada && (
          <p className="aviso" role="alert">
            <Icon nome="alerta" tamanho={16} /> Acesso negado: a aba "{abaNegada.rotulo}" exige nível{" "}
            {abaNegada.nivelMinimo}. Seu nível: {agente.nivel}.
          </p>
        )}

        <div className="painel-aba">{renderAba()}</div>
      </section>
    </>
  );
};

export default Agentes;
