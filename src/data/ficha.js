// Listas fixas da ficha (atributos, perícias, status...) e o modelo de uma ficha nova.
export const ATRIBUTOS = [
  { id: "aut", sigla: "AUT", nome: "Autocontrole" },
  { id: "vig", sigla: "VIG", nome: "Vigor" },
  { id: "for", sigla: "FOR", nome: "Força" },
  { id: "int", sigla: "INT", nome: "Intelecto" },
  { id: "car", sigla: "CAR", nome: "Carisma" },
  { id: "des", sigla: "DES", nome: "Destreza" },
];

// Perícias agrupadas por atributo: [nome, id do atributo]
export const PERICIAS = [
  ["Concentração", "aut"], ["Determinação", "aut"], ["Mentalidade", "aut"],
  ["Fortitude", "vig"], ["Tolerância", "vig"],
  ["Atletismo", "for"], ["Luta", "for"],
  ["Ciências", "int"], ["Investigação", "int"], ["Medicina", "int"], ["Tecnologia", "int"], ["Engenharia", "int"], ["Crime", "int"],
  ["Persuasão", "car"], ["Enganação", "car"], ["Intimidação", "car"], ["Social", "car"],
  ["Furtividade", "des"], ["Pontaria", "des"], ["Reflexos", "des"], ["Prestidigitação", "des"],
];

export const ATRIBUTO_MAX = 8;
export const TIPOS_SANGUE = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "RH"];
export const STATUS = ["Normal", "Furioso", "Paranoico", "Psicótico", "Obcecado", "Eufórico", "Calmo", "Nervosismo", "Exausto", "Amedrontado", "Inspirado", "Angustiado", "Atordoado", "Customizado"];
const ESTRESSE_TOTAL = 10;

export const fichaInicial = (agente) => ({
  personagem: agente?.nome || "", jogador: "", nivel: 1, classe: "", sangue: agente?.tipoSanguineo || "O+", status: "Normal", statusCustom: "",
  hpAtual: 0, hpTotal: 0,
  atributos: { aut: 1, vig: 1, for: 1, int: 1, car: 1, des: 1 },
  exposicao: 0, // 0 a 100 (%): quanto menor, mais seguro
  estresse: Array(ESTRESSE_TOTAL).fill(false),
  bonus: {},
  ataques: [{ nome: "", teste: "", dano: "" }],
  origem: "", altura: "", nascimento: agente?.dataNascimento || "", localNascimento: agente?.localNascimento || "", aparencia: "", backstory: "", relacionamentos: [],
  energiaAtual: 0, energiaTotal: 0, reabilitado: false,
  habilidades: [], inventario: [], inventarioMax: 8, mochila: [], mochilaAtiva: true, mochilaCat: null,
});
