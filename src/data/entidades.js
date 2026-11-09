// ============================================================
//  ENTIDADES (aba "Entidades" da Navbar) — todas arquivadas.
//  nivel: nível de acesso mínimo para VER a entidade (1 a 5; o Mestre vê todas).
//  contencao: um dos valores de CONTENCAO.  foto: URL (opcional).
//  Use [[texto]] na descrição para tarjar trechos.
// ============================================================

export const CONTENCAO = [
  { valor: "seguro", rotulo: "Seguro", cor: "#6fd34a" },
  { valor: "neutralizado", rotulo: "Neutralizado", cor: "#4fb3d9" },
  { valor: "desclassificado", rotulo: "Desclassificado", cor: "#a3a3a3" },
  { valor: "instavel", rotulo: "Instável", cor: "#e3a52e" },
  { valor: "caos", rotulo: "Caos", cor: "#e5413f" },
  { valor: "pendente", rotulo: "Pendente", cor: "#b58be0" },
];

export const ENTIDADES = [
  {
    id: "435562",
    nome: "O Passageiro",
    contencao: "seguro",
    nivel: 1,
    foto: "",
    descricao:
      "Humanoide que se locomove como quadrúpede, avistado nos trilhos de Paranapiacaba em 1973. Primeira entidade capturada pela Fundação.\n\nMantida em cela de contenção leve. Texto de exemplo: substitua pela descrição real.",
  },
  {
    id: "208841",
    nome: "Lâmpada Sussurrante",
    contencao: "neutralizado",
    nivel: 1,
    foto: "",
    descricao:
      "Poste de iluminação que sussurra nomes de quem passa embaixo dele. Neutralizada na operação OP-002.\n\nOs civis expostos foram acompanhados e a versão oficial foi [[falha elétrica]].",
  },
  {
    id: "771930",
    nome: "Eco do Vagão",
    contencao: "instavel",
    nivel: 2,
    foto: "",
    descricao:
      "Presença sonora associada a desaparecimentos em composições de trem. Escapou durante a captura em OP-003.\n\nQualquer áudio gravado no vagão deve ser enviado ao setor de Arquivos.",
  },
  {
    id: "119204",
    nome: "Maré Vermelha",
    contencao: "pendente",
    nivel: 3,
    foto: "",
    descricao:
      "Evento extraordinário no litoral de Ubatuba que altera o comportamento de quem entra em contato com a água. Aguardando classificação da Cientista Principal.",
  },
  {
    id: "903317",
    nome: "O Arquivista",
    contencao: "caos",
    nivel: 4,
    foto: "",
    descricao:
      "Entidade que reorganiza documentos e memórias. Última contenção rompida no subsolo B.\n\nProcedimento: [[evacuar o setor e selar os corredores]].",
  },
  {
    id: "000001",
    nome: "Projeto Ômega",
    contencao: "desclassificado",
    nivel: 5,
    foto: "",
    descricao: "Material de circulação restrita à Diretoria. [[Dados expurgados.]]",
  },
];

export default ENTIDADES;
