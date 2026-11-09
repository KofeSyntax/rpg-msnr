// Seção "Contratos": única seção, além do aviso, visível para visitantes.
import ContratoCard from "./ContratoCard";
import { useDados } from "../context/DataContext";

const SecaoContratos = () => {
  const { db } = useDados();
  return (
    <section id="contratos" className="secao">
      <div className="secao-interna">
        <div className="bx bx-contratos">
          <h1>Contratos</h1>
          <div className="cards">
            {db.contratos.map((contrato) => (
              <ContratoCard
                key={contrato.id}
                titulo={contrato.titulo}
                texto={contrato.texto}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecaoContratos;
