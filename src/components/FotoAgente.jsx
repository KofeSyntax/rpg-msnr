import { useState } from "react";
import { iniciais } from "../utils/formatar";

// Foto do agente (URL da web). Se não carregar, mostra as iniciais.
const FotoAgente = ({ src, nome, className = "" }) => {
  const [falhou, setFalhou] = useState(false);

  if (!src || falhou) {
    return (
      <div
        className={`foto-agente foto-iniciais ${className}`}
        role="img"
        aria-label={nome}
      >
        {iniciais(nome)}
      </div>
    );
  }

  return (
    <img
      className={`foto-agente ${className}`}
      src={src}
      alt={`Foto de ${nome}`}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  );
};

export default FotoAgente;
