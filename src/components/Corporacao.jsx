import FotoAgente from "./FotoAgente";
import { useDados } from "../context/DataContext";

// Informações da corporação: diretoria e divisões (dados em data/corporacao.js).
const Corporacao = () => {
  const { db } = useDados();
  return (
    <section className="corporacao">
      <p className="intro">{db.config.corporacaoIntro}</p>

      {db.corporacao.map((grupo) => (
        <div className="camada" key={grupo.id}>
          <h2>{grupo.camada}</h2>
          <div className="grade-corp">
            {grupo.membros.map((m, i) => (
              <article className="membro" key={`${m.cargo}-${i}`}>
                <FotoAgente src={m.foto} nome={m.nome} />
                <div>
                  <p className="membro-cargo">{m.cargo}</p>
                  <h3>{m.nome}</h3>
                  <p className="membro-setor">{m.setor} · Nível {m.nivel}</p>
                  <p className="membro-desc">{m.descricao}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}

    </section>
  );
};

export default Corporacao;
