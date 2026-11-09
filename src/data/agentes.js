// ============================================================
//  AGENTES DE TESTE (login)
//  Para adicionar um agente, copie um objeto e troque os campos.
//  Segurança NÃO é preocupação aqui: as senhas ficam em texto puro.
//
//  tipo: "jogador" (padrão) ou "npc"
//  papel: "mestre" (opcional) = cargo especial do mestre de RPG
//  nivel: 0 a 5  (controla quais abas são liberadas — ver data/abas.js)
//  dataNascimento: formato AAAA-MM-DD
//  foto: URL de qualquer imagem (aqui, retratos de exemplo da web)
// ============================================================

export const AGENTES = [
  {
    id: "EXP-0417",
    senha: "lanterna17",
    nome: "Tiago Ferraz",
    cargo: "Agente de Exploração",
    nivel: 1,
    tipoSanguineo: "O+",
    localNascimento: "Santos, SP",
    dataNascimento: "1993-08-21",
    equipe: "DELT4",
    foto: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "EXP-0832",
    senha: "corvo832",
    nome: "Marina Albuquerque",
    cargo: "Agente de Exploração Sênior",
    nivel: 3,
    tipoSanguineo: "A-",
    localNascimento: "Paranapiacaba, SP",
    dataNascimento: "1989-02-09",
    equipe: "DELT4",
    foto: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    // Agente de nível superior
    id: "DIR-0001",
    senha: "omega-protocolo",
    nome: "Helena Vasconcellos Prado",
    cargo: "Diretora de Operações de Campo",
    nivel: 5,
    tipoSanguineo: "AB+",
    localNascimento: "São Paulo, SP",
    dataNascimento: "1978-11-30",
    equipe: "COMANDO",
    foto: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    // NPC: sem ficha editável; só o Mestre edita os dados do cartão
    id: "NPC-0001",
    senha: "npc0001",
    tipo: "npc",
    nome: "Dra. Helena Duarte",
    cargo: "Médica de campo",
    nivel: 2,
    tipoSanguineo: "A-",
    localNascimento: "Santos, SP",
    dataNascimento: "1984-05-17",
    classe: "Suporte",
    altura: "168",
    equipe: "DELT4",
    foto: "",
  },
  {
    // Cargo especial: mestre de RPG (acesso total + aba "Mestre" na Navbar)
    id: "MESTRE",
    senha: "mestrando",
    nome: "Mestre",
    cargo: "Mestre de Jogo",
    papel: "mestre",
    nivel: 5,
    tipoSanguineo: "O+",
    localNascimento: "",
    dataNascimento: "",
    equipe: "",
    foto: "",
  },
];

export default AGENTES;
