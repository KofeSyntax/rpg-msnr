// Aviso de página restrita, mostrado no topo da Home.
import { useDados } from "../context/DataContext";

const AlertaBox = () => {
  const { db } = useDados();
  const alerta = db.config.alerta;
  return (
    <section id="alerta">
      <div id="alerta-box">
        <h1>{alerta.titulo}</h1>
        <h3>{alerta.corpo}</h3>
      </div>
    </section>
  );
};

export default AlertaBox;
