// ============================================================
//  TEXTOS E PLACEHOLDERS DO SITE
//  Edite aqui para trocar textos sem mexer nos componentes.
//  (Os textos abaixo são os mesmos do index.html original.)
// ============================================================

export const SITE = {
  sigla: "M.S.N.R.",
  nomeCompleto: "Monitoramento de Seres Não-Registrados",
  tituloCartao: "FUNDAÇÃO MSNR",
  equipePadrao: "DELT4",

  alerta: {
    titulo: "ESTA PÁGINA É RESTRITA A ASSOCIADOS DA FUNDAÇÃO",
    corpo:
      "Caso você não seja associado à fundação, saia do domínio imediatamente, esse não é o seu lugar. Qualquer tentativa de invasão a corporação será identificada, localizada e detida.",
  },

  sobre: [
    'A fundação MSNR foi idealizada no dia 27 de dezembro de 1973, após a aparição de um ser não identificado em Paranapiacaba no meio de um dos trilhos da via ferroviária principal do município, o ser foi descrito com uma aparência humanoide, mas que se locomovia como um quadrúpede. Os moradores da região começaram a espalhar boatos sobre uma possível "invasão alienígena", mas mesmo com os alardes sobre esse caso, nenhum tipo de registro fotográfico foi documentado, apenas relatos de moradores e uma ligação feita a policia local, O governo preferiu não trazer nenhuma informação à publico, acobertando todas as informações sobre o acontecimento e subornando as principais testemunhas.',
    "A fundação MSNR foi oficialmente criada em 12 de fevereiro de 1974, sendo sua primeira ação a captura dessa entidade. Atualmente, a principal função da corporação é a contenção, estudo e eliminação de entidades e locais considerados sobrenaturais, com o objetivo de controlar qualquer tipo de caos generalizado que possa decorrer do contato do público geral a tais eventos extraordinários. As causas dos eventos registrados pela corporação até o momento atual não parecem ter uma causa clara.",
  ],

  contratos: [
    {
      titulo: "RASTREAMENTO",
      texto:
        "Sumiços de pessoas de forma suspeita, sem testemunhas, evidências ou pistas podem estar associadas ao sobrenatural",
    },
    {
      titulo: "CAPTURA",
      texto:
        "Se deparou com alguma entidade, criatura ou monstro? Agentes especializados na apreensão de seres sobrenaturais serão enviados para o local",
    },
    {
      titulo: "LIMPEZA",
      texto:
        "A área de limpeza da fundação é voltada a apaziguação da massa populacional em caso de contato com o sobrenatural",
    },
    {
      titulo: "QUARENTENA",
      texto:
        "No caso de infecção, doença ou mudança de caráter após presenciar evento extraordinário, é necessária a quarentena dos afetados para a normalização da situação",
    },
  ],

  // Vídeo de boas-vindas (link do YouTube, Vimeo ou arquivo de vídeo). O Mestre troca pelo painel.
  videoBoasVindas: "",

  // Unidades da Fundação (seção "Sobre"). imagem = URL. O Mestre edita pelo painel.
  unidades: [
    { nome: "Sede Central", imagem: "", descricao: "Centro de comando, arquivos e contenção de alto risco." },
    { nome: "Base de Paranapiacaba", imagem: "", descricao: "Primeira unidade de campo, erguida junto aos trilhos." },
    { nome: "Laboratório Litoral", imagem: "", descricao: "Estudo de eventos costeiros e amostras biológicas." },
  ],

  // Texto de apresentação da aba "Corporação" (placeholder)
  corporacaoIntro:
    "A Fundação opera como uma corporação: uma diretoria que define o sigilo e divisões científicas que estudam e classificam. Abaixo está a estrutura atual (dados de exemplo — edite em data/corporacao.js).",
};

export default SITE;
