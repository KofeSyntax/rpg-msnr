// ============================================================
//  ABAS DA PÁGINA "AGENTES" E NÍVEL MÍNIMO PARA CADA UMA (0 a 5)
//  somenteJogador: NPCs não têm essa aba.
// ============================================================

export const ABAS = [
  { id: "ficha", rotulo: "Ficha", nivelMinimo: 0, somenteJogador: true },
  { id: "anotacoes", rotulo: "Anotações", nivelMinimo: 0 },
  { id: "missoes", rotulo: "Missões", nivelMinimo: 0 },
  { id: "arquivos", rotulo: "Arquivos", nivelMinimo: 0 },
  { id: "banco", rotulo: "Banco de Dados", nivelMinimo: 1 },
  { id: "pesquisa", rotulo: "Pesquisar agente", nivelMinimo: 2 },
];

// Nome de cada nível (posição = número do nível)
export const NIVEIS = ["Visitante", "Observador", "Explorador", "Investigador", "Coordenador", "Diretoria"];

export default ABAS;
