import { STATUS_MISSAO } from "../data/missoes";

// Selo de status da missão (não iniciada, concluída, falha, finalizada, arquivada)
const StatusBadge = ({ status }) => {
  const item = STATUS_MISSAO.find((s) => s.valor === status);
  return (
    <span className={`selo selo-st-${status}`}>{item ? item.rotulo : status}</span>
  );
};

export default StatusBadge;
