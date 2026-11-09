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

const foto = (semente, legenda) => ({
  url: `https://picsum.photos/seed/${semente}/640/420?grayscale`,
  legenda,
});

export const MISSOES = [
  {
    id: "op-001",
    codigo: "OP-001",
    nome: "Eco na Via Férrea",
    status: "concluida",
    dataInicio: "2026-03-14",
    local: "Paranapiacaba, SP",
    agentes: ["EXP-0417", "EXP-0832"],
    descricao:
      "Moradores relataram ruídos metálicos e sombras se movendo sobre os trilhos durante a madrugada. A equipe isolou o trecho, coletou registros sonoros e confirmou atividade não catalogada. Texto de exemplo: substitua pela descrição real da missão.",
    imagens: [
      foto("msnr-op001-a", "Trecho isolado da via principal"),
      foto("msnr-op001-b", "Ponto de coleta de áudio"),
      foto("msnr-op001-c", "Marcas encontradas no balastro"),
    ],
  },
  {
    id: "op-002",
    codigo: "OP-002",
    nome: "Silêncio no Bairro Velho",
    status: "finalizada",
    dataInicio: "2026-05-02",
    local: "Campinas, SP",
    agentes: ["EXP-0417", "DIR-0001"],
    descricao:
      "Operação de limpeza após contato de civis com uma lâmpada que sussurrava nomes. Testemunhas foram acompanhadas e a versão oficial de falha elétrica foi distribuída. Texto de exemplo.",
    imagens: [
      foto("msnr-op002-a", "Poste removido da rua"),
      foto("msnr-op002-b", "Perímetro de apaziguamento"),
    ],
  },
  {
    id: "op-003",
    codigo: "OP-003",
    nome: "Passageiro Ausente",
    status: "falha",
    dataInicio: "2026-06-19",
    local: "Linha 7, SP",
    agentes: ["EXP-0832", "EXP-0417"],
    descricao:
      "Rastreamento de um desaparecimento sem testemunhas em uma composição de trem. A entidade escapou durante a captura e o contrato foi reaberto. Texto de exemplo.",
    imagens: [
      foto("msnr-op003-a", "Vagão inspecionado"),
      foto("msnr-op003-b", "Câmera de segurança adulterada"),
      foto("msnr-op003-c", "Rota de fuga provável"),
      foto("msnr-op003-d", "Pertences encontrados"),
    ],
  },
  {
    id: "op-004",
    codigo: "OP-004",
    nome: "Quarentena Setor 7",
    status: "nao-iniciada",
    dataInicio: "2026-12-01",
    local: "Ubatuba, SP",
    agentes: ["EXP-0832", "DIR-0001", "EXP-0417"],
    descricao:
      "Missão agendada: isolar uma vila litorânea afetada por mudanças de comportamento após um evento extraordinário na maré. Aguardando liberação da diretoria. Texto de exemplo.",
    imagens: [foto("msnr-op004-a", "Mapa preliminar da área")],
  },
  {
    id: "op-005",
    codigo: "OP-005",
    nome: "Arquivo Morto",
    status: "arquivada",
    dataInicio: "2025-11-30",
    local: "Sede (subsolo B)",
    agentes: ["EXP-0417", "EXP-0832", "DIR-0001"],
    descricao:
      "Inventário e recontenção de itens do arquivo antigo após uma falha de selagem. Todos os itens foram realocados e o caso foi arquivado. Texto de exemplo.",
    imagens: [
      foto("msnr-op005-a", "Corredor do subsolo B"),
      foto("msnr-op005-b", "Caixas lacradas"),
    ],
  },
];

export default MISSOES;
