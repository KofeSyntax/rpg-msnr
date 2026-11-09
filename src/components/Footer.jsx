// Rodapé do site.
import { SITE } from "../data/site";

const Footer = () => {
  return (
    <footer className="rodape">
      <p>
        {SITE.sigla} · {SITE.nomeCompleto}
      </p>
    </footer>
  );
};

export default Footer;
