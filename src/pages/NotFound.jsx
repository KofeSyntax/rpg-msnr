import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import TextoRedigido from "../components/TextoRedigido";

// Página de erro 404 (rota "*")
const NotFound = () => {
  return (
    <>
      <Banner compacto />
      <section className="pagina erro-404">
        <p className="codigo-erro">404</p>
        <h1 className="titulo-pagina">Arquivo não encontrado</h1>
        <p>
          <TextoRedigido texto="Os dados solicitados foram [[expurgados]] ou nunca existiram. Esta tentativa de acesso [[foi registrada]]." />
        </p>
        <Link to="/" className="btn btn-acento">
          voltar ao início
        </Link>
      </section>
    </>
  );
};

export default NotFound;
