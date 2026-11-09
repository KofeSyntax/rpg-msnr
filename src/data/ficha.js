// Listas fixas da ficha (atributos, perícias, status...) e o modelo de uma ficha nova.
export const ATRIBUTOS = [
  { id: "for", sigla: "FOR", nome: "Força" },
  { id: "agi", sigla: "AGI", nome: "Agilidade" },
  { id: "vig", sigla: "VIG", nome: "Vitalidade" },
  { id: "int", sigla: "INT", nome: "Intelecto" },
  { id: "pre", sigla: "PRE", nome: "Presença" },
];

export const PERICIAS = [
  ["Crime", "int"], ["Atletismo", "for"], ["Adestramento", "pre"], ["Ciências", "int"],
  ["Medicina", "int"], ["Cultura", "pre"], ["Diplomacia", "pre"], ["Resistência", "vig"],
  ["Furtividade", "agi"], ["Intimidação", "pre"], ["Intuição", "pre"], ["Investigação", "int"],
  ["Luta", "for"], ["Percepção", "pre"], ["Pilotagem", "int"], ["Mira", "agi"],
  ["Reflexos", "agi"], ["Doutrina", "pre"], ["Tecnologia", "int"], ["Determinação", "pre"],
  ["Engenharia", "int"], ["Artes", "pre"], ["Prestidigitação", "agi"],
];

export const ATRIBUTO_MAX = 8;
export const TIPOS_SANGUE = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "RH"];
export const STATUS = ["Normal", "Furioso", "Paranoico", "Psicótico", "Obcecado", "Eufórico", "Calmo", "Nervosismo", "Exausto", "Amedrontado", "Inspirado", "Angustiado", "Atordoado", "Customizado"];
const ESTRESSE_TOTAL = 10;

export const fichaInicial = (agente) => ({
  personagem: agente?.nome || "", jogador: "", nivel: 1, classe: "", sangue: agente?.tipoSanguineo || "O+", status: "Normal", statusCustom: "",
  hpAtual: 0, hpTotal: 0,
  atributos: { for: 1, agi: 1, vig: 1, int: 1, pre: 1 },
  estresse: Array(ESTRESSE_TOTAL).fill(false),
  bonus: {},
  ataques: [{ nome: "", teste: "", dano: "" }],
  origem: "", altura: "", nascimento: agente?.dataNascimento || "", localNascimento: agente?.localNascimento || "", aparencia: "", backstory: "", relacionamentos: [],
  energiaAtual: 0, energiaTotal: 0, reabilitado: false,
  habilidades: [], inventario: [], inventarioMax: 8, mochila: [], mochilaAtiva: true,
});
