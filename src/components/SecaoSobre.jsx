// Texto "Sobre" da Fundação (só para quem está logado; ver Home).
import { useDados } from "../context/DataContext";

const SecaoSobre = () => {
  const { db } = useDados();
  return (
  <section id="sobre" className="secao">
    <div className="secao-interna sobre-grid">
      <div className="bx">
        <h1>sobre</h1>
        {db.config.sobre.map((paragrafo, i) => (
          <h5 key={i}>{paragrafo}</h5>
        ))}
      </div>
    </div>
  </section>
  );
};

export default SecaoSobre;
