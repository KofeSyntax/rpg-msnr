// ============================================================
//  ESTRUTURA CORPORATIVA DA FUNDAÇÃO (aba "Corporação")
//  Nomes, cargos e fotos são placeholders — edite à vontade.
//  As "Equipes de Campo" são geradas automaticamente a partir
//  dos agentes cadastrados em data/agentes.js.
// ============================================================

export const CORPORACAO = [
  {
    camada: "Diretoria Executiva",
    membros: [
      {
        cargo: "Diretor-Geral (CEO)",
        nome: "Dr. Augusto Valença",
        setor: "Conselho Superior",
        nivel: 5,
        foto: "https://randomuser.me/api/portraits/men/75.jpg",
        descricao:
          "Responde apenas ao Conselho e define a política de contenção e de sigilo da Fundação.",
      },
      {
        cargo: "Cientista Principal",
        nome: "Dra. Ísis Carvalhaes",
        setor: "Pesquisa & Classificação",
        nivel: 5,
        foto: "https://randomuser.me/api/portraits/women/21.jpg",
        descricao:
          "Lidera os estudos sobre entidades e locais e aprova toda nova classificação de ameaça.",
      },
      {
        cargo: "Diretora de Operações de Campo",
        nome: "Helena Vasconcellos Prado",
        setor: "Operações",
        nivel: 5,
        foto: "https://randomuser.me/api/portraits/women/65.jpg",
        descricao:
          "Comanda as equipes de exploração e autoriza o início de cada missão.",
      },
    ],
  },
  {
    camada: "Divisões Científicas e Técnicas",
    membros: [
      {
        cargo: "Chefe de Contenção",
        nome: "Rafael Moreira Duarte",
        setor: "Contenção",
        nivel: 4,
        foto: "https://randomuser.me/api/portraits/men/41.jpg",
        descricao:
          "Projeta e mantém as celas, selos e protocolos de contenção das entidades capturadas.",
      },
      {
        cargo: "Arquivista-Chefe",
        nome: "Beatriz Lemos",
        setor: "Arquivos",
        nivel: 4,
        foto: "https://randomuser.me/api/portraits/women/33.jpg",
        descricao:
          "Guarda os registros, dossiês e relatórios de missão e controla quem pode lê-los.",
      },
      {
        cargo: "Coordenador de Quarentena",
        nome: "Dr. Caio Nascimento",
        setor: "Saúde & Quarentena",
        nivel: 4,
        foto: "https://randomuser.me/api/portraits/men/52.jpg",
        descricao:
          "Acompanha civis e agentes afetados por eventos extraordinários até a normalização.",
      },
    ],
  },
  {
    camada: "Segurança e Relações Públicas",
    membros: [
      {
        cargo: "Chefe de Segurança",
        nome: "Cel. Otávio Brandão",
        setor: "Segurança",
        nivel: 4,
        foto: "https://randomuser.me/api/portraits/men/12.jpg",
        descricao:
          "Protege as instalações e identifica, localiza e detém qualquer tentativa de invasão.",
      },
      {
        cargo: "Chefe de Apaziguamento Público",
        nome: "Lúcia Tavares",
        setor: "Comunicação",
        nivel: 3,
        foto: "https://randomuser.me/api/portraits/women/8.jpg",
        descricao:
          "Cuida da versão oficial dos fatos para evitar alarde e manter a paz entre os cidadãos.",
      },
    ],
  },
];

export default CORPORACAO;
