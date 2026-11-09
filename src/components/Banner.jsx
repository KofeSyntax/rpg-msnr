// A imagem do banner fica em public/imagens/banner.jpg
// (o caminho é definido no CSS, na classe .banner).
const Banner = ({ compacto = false }) => {
  return (
    <section
      id="banner"
      className={compacto ? "banner banner-compacto" : "banner"}
      role="img"
      aria-label="Banner da Fundação"
    />
  );
};

export default Banner;
