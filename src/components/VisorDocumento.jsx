import { useState, useEffect } from "react";
import { trocarPorPlaceholder } from "../utils/formatar";

// Mostra o conteúdo de um documento: texto, imagem (clique para ampliar) ou link.
const VisorDocumento = ({ doc }) => {
  const [ampliada, setAmpliada] = useState(false);

  useEffect(() => {
    if (!ampliada) return;
    const fechar = (e) => { if (e.key === "Escape") setAmpliada(false); };
    window.addEventListener("keydown", fechar);
    return () => window.removeEventListener("keydown", fechar);
  }, [ampliada]);

  if (doc.tipo === "imagem") {
    return (
      <>
        <button type="button" className="doc-img-btn" onClick={() => setAmpliada(true)} title="Clique para ampliar" aria-label={`Ampliar imagem: ${doc.titulo}`}>
          <img className="doc-imagem" src={doc.conteudo} alt={doc.titulo} onError={trocarPorPlaceholder} />
        </button>
        {ampliada && (
          <div className="lightbox" onClick={() => setAmpliada(false)} role="dialog" aria-label="Imagem ampliada">
            <button type="button" className="lightbox-fechar" aria-label="Fechar" onClick={() => setAmpliada(false)}>×</button>
            <img src={doc.conteudo} alt={doc.titulo} onError={trocarPorPlaceholder} />
          </div>
        )}
      </>
    );
  }
  if (doc.tipo === "link") {
    return (
      <a href={doc.conteudo} target="_blank" rel="noreferrer noopener">
        {doc.conteudo}
      </a>
    );
  }
  return <pre className="doc-texto">{doc.conteudo}</pre>;
};

export default VisorDocumento;
