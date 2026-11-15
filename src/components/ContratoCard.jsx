// Cartão de um contrato (título + texto) da seção Contratos.
const ContratoCard = ({ titulo, texto }) => {
  return (
    <div className="card">
      <h1>{titulo}</h1>
      <h5>{texto}</h5>
    </div>
  );
};

export default ContratoCard;
