// ============================================================
//  BANCO DE DADOS (aba "Banco de Dados" dos agentes) — editado pelo MESTRE no painel.
//  nivel: nível de acesso mínimo para abrir o arquivo (1 a 5). Nível 0 não vê nada.
//  Para "tarjar" um trecho, coloque-o entre [[ e ]]:  "visto em [[local expurgado]]".
// ============================================================

export const AMEACAS = ["Baixa", "Média", "Alta"];
export const STATUS_BANCO = ["Contida", "Em observação", "Em monitoramento", "Neutralizada"];

export const BANCO = [
  {
    id: "msnr-001", codigo: "MSNR-001", designacao: "O Quadrúpede da Via", local: "Paranapiacaba, SP",
    ameaca: "Média", status: "Contida", data: "1974-02-12", nivel: 1,
    descricao: "Entidade de aparência humanoide que se locomove como um quadrúpede. Avistada pela primeira vez em 27/12/1973 sobre os trilhos principais. Comunica-se por [[sons de trem imitados]] e evita luz direta.",
    contencao: "Mantida em câmara de baixa luminosidade com piso metálico. Qualquer alteração de comportamento deve ser reportada em até [[dez minutos]].",
    incidentes: ["12/02/1974 — Captura inicial, primeira ação da Fundação.", "03/09/1991 — Tentativa de fuga contida pela equipe [[ALFA-2]]."],
  },
  {
    id: "msnr-014", codigo: "MSNR-014", designacao: "O Passageiro Ausente", local: "Linha 7, SP",
    ameaca: "Baixa", status: "Em observação", data: "2026-06-19", nivel: 1,
    descricao: "Presença que ocupa assentos vazios em composições ferroviárias à noite. Quem se senta ao lado relata esquecer [[o próprio destino]].",
    contencao: "Ainda não contida. Monitoramento por câmeras e patrulha de agentes na Linha 7. Texto de exemplo.",
    incidentes: ["19/06/2026 — Tentativa de captura (OP-003) sem sucesso."],
  },
  {
    id: "msnr-027", codigo: "MSNR-027", designacao: "Lâmpada que Sussurra", local: "Campinas, SP",
    ameaca: "Baixa", status: "Contida", data: "2026-03-03", nivel: 2,
    descricao: "Poste de iluminação que sussurra nomes de quem passa embaixo dele. Texto de exemplo.",
    contencao: "Removida da via e armazenada no almoxarifado B3.",
    incidentes: [],
  },
  {
    id: "msnr-033", codigo: "MSNR-033", designacao: "Casa 14 da Rua Sem Fim", local: "Local não confirmado",
    ameaca: "Alta", status: "Em monitoramento", data: "2025-11-20", nivel: 3,
    descricao: "Residência que aparece em ruas diferentes, sempre com o número 14. Quem entra costuma sair [[horas antes de ter entrado]].",
    contencao: "Proibida a entrada sem autorização da Diretoria. Perímetro móvel de equipes de limpeza. Texto de exemplo.",
    incidentes: ["Sem registros liberados para este nível."],
  },
  {
    id: "msnr-048", codigo: "MSNR-048", designacao: "Maré Seca", local: "Ubatuba, SP",
    ameaca: "Alta", status: "Em monitoramento", data: "2026-01-15", nivel: 4,
    descricao: "Recuo súbito do mar seguido de silêncio total. Pessoas expostas apresentam [[amnésia seletiva]]. Texto de exemplo.",
    contencao: "Sem contenção possível; apenas monitoramento costeiro.",
    incidentes: [],
  },
  {
    id: "msnr-052", codigo: "MSNR-052", designacao: "Corredor Dobrável", local: "Sede (subsolo B)",
    ameaca: "Média", status: "Neutralizada", data: "2024-08-09", nivel: 4,
    descricao: "Corredor cuja extensão muda a cada travessia. Neutralizado com a selagem de ambas as extremidades. Texto de exemplo.",
    contencao: "Extremidades seladas. Acesso proibido.",
    incidentes: [],
  },
  {
    id: "proj-omega", codigo: "PROJ-ÔMEGA", designacao: "Origem dos eventos extraordinários", local: "Sede, subsolo B",
    ameaca: "Alta", status: "Em monitoramento", data: "1976-01-01", nivel: 5,
    descricao: "As causas dos eventos registrados ainda não são claras, mas o Conselho suspeita de [[um padrão geográfico entre os casos]]. Todos os dados foram transferidos para [[Sede, subsolo B]].",
    contencao: "Circulação restrita à Diretoria. Texto de exemplo.",
    incidentes: [],
  },
];

export default BANCO;
