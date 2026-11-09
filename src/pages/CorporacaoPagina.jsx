import Banner from "../components/Banner";
import Corporacao from "../components/Corporacao";

// Rota: /corporacao (protegida por RotaProtegida no App.jsx)
const CorporacaoPagina = () => (
  <>
    <Banner compacto />
    <section className="pagina">
      <h1 className="titulo-pagina">Corporação</h1>
      <Corporacao />
    </section>
  </>
);

export default CorporacaoPagina;
