import { useDados } from "../context/DataContext";
import { trocarPorPlaceholder } from "../utils/formatar";

// Unidades da Fundação: imagem com uma descrição curta embaixo.
const SecaoUnidades = () => {
  const { db } = useDados();
  return (
    <section id="unidades" className="secao">
      <div className="secao-interna">
        <div className="bx">
          <h1>unidades da fundação</h1>
          <div className="grade-unidades">
            {db.config.unidades.map((u, i) => (
              <figure key={i} className="unidade">
                {u.imagem ? (
                  <img src={u.imagem} alt={u.nome} loading="lazy" onError={trocarPorPlaceholder} />
                ) : (
                  <div className="unidade-vazia" role="img" aria-label="Sem imagem">[imagem]</div>
                )}
                <figcaption>
                  <strong>{u.nome}</strong>
                  <span>{u.descricao}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecaoUnidades;
