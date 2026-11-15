import { useNavigate, useParams } from "react-router-dom";
import Banner from "../components/Banner";
import Icon from "../components/Icon";
import TextoRedigido from "../components/TextoRedigido";
import { useAuth } from "../context/AuthContext";
import { useDados } from "../context/DataContext";
import { formatarData } from "../utils/formatar";

// Rota: /agentes/banco/:id — arquivo do banco de dados (só abre se o nível do agente alcançar).
const BancoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agente } = useAuth();
  const { db } = useDados();
  const e = db.banco.find((x) => x.id === id);
  const voltar = () => navigate("/agentes", { state: { aba: "banco" } });

  if (!e || agente.nivel < 1 || agente.nivel < e.nivel) {
    return (
      <>
        <Banner compacto />
        <section className="pagina">
          <p className="aviso"><Icon nome="alerta" tamanho={16} /> Arquivo não encontrado ou acima do seu nível de acesso.</p>
          <button type="button" className="btn" onClick={voltar}><Icon nome="voltar" tamanho={16} /> voltar ao banco de dados</button>
        </section>
      </>
    );
  }

  return (
    <>
      <Banner compacto />
      <section className="pagina">
        <button type="button" className="btn btn-fantasma" onClick={voltar}><Icon nome="voltar" tamanho={16} /> voltar ao banco de dados</button>

        <header className="missao-cab">
          <p className="codigo">Item #: {e.codigo}</p>
          <h1>{e.designacao}</h1>
        </header>

        <dl className="missao-info">
          <div><dt>Data</dt><dd>{formatarData(e.data)}</dd></div>
          <div><dt>Local</dt><dd>{e.local}</dd></div>
          <div><dt>Ameaça</dt><dd>{e.ameaca}</dd></div>
          <div><dt>Status</dt><dd>{e.status}</dd></div>
          <div><dt>Nível de acesso</dt><dd>{e.nivel}</dd></div>
        </dl>

        <h2 className="subtitulo">Descrição</h2>
        <p className="missao-descricao"><TextoRedigido texto={e.descricao} /></p>

        {e.contencao && (
          <>
            <h2 className="subtitulo">Procedimentos de contenção</h2>
            <p className="missao-descricao"><TextoRedigido texto={e.contencao} /></p>
          </>
        )}

        <h2 className="subtitulo">Incidentes</h2>
        {e.incidentes.length === 0 ? (
          <p className="vazio">Nenhum incidente registrado.</p>
        ) : (
          <ul className="lista-incidentes">
            {e.incidentes.map((i, k) => <li key={k}><TextoRedigido texto={i} /></li>)}
          </ul>
        )}
      </section>
    </>
  );
};

export default BancoDetalhe;
