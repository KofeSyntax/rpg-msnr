// Mostra um texto trocando os trechos [[assim]] por tarjas pretas (estilo documento classificado).
const TextoRedigido = ({ texto }) => {
  const partes = texto.split(/(\[\[.*?\]\])/g);
  return (
    <>
      {partes.map((parte, i) =>
        parte.startsWith("[[") ? (
          <span key={i} className="redigido" title="Dados expurgados">
            {parte.slice(2, -2)}
          </span>
        ) : (
          <span key={i}>{parte}</span>
        )
      )}
    </>
  );
};

export default TextoRedigido;
