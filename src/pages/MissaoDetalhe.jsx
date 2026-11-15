import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Banner from "../components/Banner";
import Icon from "../components/Icon";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useDados } from "../context/DataContext";
import { ehMestre } from "../utils/regras";
import { formatarData, trocarPorPlaceholder } from "../utils/formatar";

// Rota: /agentes/missoes/:id  (protegida por RotaProtegida no App.jsx)
const MissaoDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agente } = useAuth();
  const { db } = useDados();
  const [imagemAberta, setImagemAberta] = useState(null);

  const missao = db.missoes.find((m) => m.id === id);
  const permitido = missao && (ehMestre(agente) || missao.agentes.includes(agente.id));

  const voltar = () => navigate("/agentes", { state: { aba: "missoes" } });

  if (!permitido) {
    return (
      <>
        <Banner compacto />
        <section className="pagina">
          <p className="aviso">
            <Icon nome="alerta" tamanho={16} /> Missão não encontrada ou fora do seu histórico.
          </p>
          <button type="button" className="btn" onClick={voltar}>
            <Icon nome="voltar" tamanho={16} /> voltar às missões
          </button>
        </section>
      </>
    );
  }

  const nomes = missao.agentes.map((aid) => db.agentes.find((a) => a.id === aid)?.nome || aid);

  return (
    <>
      <Banner compacto />
      <section className="pagina">
        <button type="button" className="btn btn-fantasma" onClick={voltar}>
          <Icon nome="voltar" tamanho={16} /> voltar às missões
        </button>

        <header className="missao-cab">
          <p className="codigo">{missao.codigo}</p>
          <h1>{missao.nome}</h1>
          <StatusBadge status={missao.status} />
        </header>

        <dl className="missao-info">
          <div>
            <dt>Data de início</dt>
            <dd>{formatarData(missao.dataInicio)}</dd>
          </div>
          <div>
            <dt>Local</dt>
            <dd>{missao.local}</dd>
          </div>
          <div>
            <dt>Agentes envolvidos</dt>
            <dd>{nomes.join(", ")}</dd>
          </div>
        </dl>

        <h2 className="subtitulo">Descrição</h2>
        <p className="missao-descricao">{missao.descricao}</p>

        <h2 className="subtitulo">Imagens da missão</h2>
        {missao.imagens.length === 0 ? (
          <p className="vazio">Nenhuma imagem registrada.</p>
        ) : (
          <div className="galeria">
            {missao.imagens.map((img) => (
              <figure key={img.url} onClick={() => setImagemAberta(img)}>
                <img src={img.url} alt={img.legenda} loading="lazy" onError={trocarPorPlaceholder} />
                <figcaption>{img.legenda}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {imagemAberta && (
        <div className="lightbox" onClick={() => setImagemAberta(null)} role="dialog" aria-label="Imagem ampliada">
          <img src={imagemAberta.url} alt={imagemAberta.legenda} onError={trocarPorPlaceholder} />
        </div>
      )}
    </>
  );
};

export default MissaoDetalhe;
