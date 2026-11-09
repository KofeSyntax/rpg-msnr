import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../components/Icon";
import CodigoBarras from "../components/CodigoBarras";
import TextoRedigido from "../components/TextoRedigido";
import Banner from "../components/Banner";
import { useAuth } from "../context/AuthContext";
import { useDados } from "../context/DataContext";
import { CONTENCAO } from "../data/entidades";
import { ehMestre } from "../utils/regras";

// Rota: /entidades/:id — arquivo da entidade (sempre escuro, como no design de referência).
const EntidadeDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agente } = useAuth();
  const { db } = useDados();
  const [fotoFalhou, setFotoFalhou] = useState(false);
  const e = db.entidades.find((x) => x.id === id);
  const voltar = () => navigate("/entidades");

  if (!e || !(ehMestre(agente) || agente.nivel >= e.nivel)) {
    return (
      <>
        <Banner compacto />
        <section className="pagina">
          <p className="aviso"><Icon nome="alerta" tamanho={16} /> Entidade não encontrada ou fora do seu nível de acesso.</p>
          <button type="button" className="btn" onClick={voltar}><Icon nome="voltar" tamanho={16} /> voltar</button>
        </section>
      </>
    );
  }

  const cont = CONTENCAO.find((c) => c.valor === e.contencao);

  return (
    <>
    <Banner compacto />
    <div className="entidade-pagina">
      <button type="button" className="ent-voltar" onClick={voltar}>
        <span aria-hidden="true">&lt;</span> Voltar
      </button>

      <div className="ent-grade">
        <div className="ent-lateral">
          {e.foto && !fotoFalhou ? (
            <img className="ent-foto" src={e.foto} alt={`Foto de ${e.nome}`} onError={() => setFotoFalhou(true)} />
          ) : (
            <div className="ent-foto ent-foto-vazia" role="img" aria-label="Sem foto">[foto]</div>
          )}
          <CodigoBarras valor={e.id} />
        </div>

        <div className="ent-corpo">
          <header className="ent-cab">
            <div>
              <div className="ent-titulo">
                <h1>{e.nome}</h1>
                <span className="ent-id">(ID-{e.id})</span>
              </div>
              <p className="ent-status" style={{ color: cont?.cor }}>{cont ? cont.rotulo : e.contencao}</p>
            </div>
            <div className="ent-losango" aria-label={`Nível ${e.nivel}`}>
              <i aria-hidden="true" />
              <div><strong>{e.nivel}</strong><span>Nível</span></div>
            </div>
          </header>

          <div className="ent-texto">
            {e.descricao.split(/\n\s*\n/).map((p, i) => (
              <p key={i}><TextoRedigido texto={p} /></p>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EntidadeDetalhe;
