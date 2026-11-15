// ============================================================
//  MISSÕES (aba "Missões")
//  Estas são as missões iniciais; o mestre cria/edita/exclui pelo painel.
//  agentes: lista de IDs de agentes que participaram da missão.
//  imagens: URLs da web (aqui, fotos de exemplo em tons de cinza).
//  dataInicio: AAAA-MM-DD
// ============================================================

export const STATUS_MISSAO = [
  { valor: "nao-iniciada", rotulo: "Não iniciada" },
  { valor: "concluida", rotulo: "Concluída" },
  { valor: "falha", rotulo: "Falha" },
  { valor: "finalizada", rotulo: "Finalizada" },
  { valor: "arquivada", rotulo: "Arquivada" },
];


// Vazio: o Mestre cria as missões pelo painel.
export const MISSOES = [];

export default MISSOES;
