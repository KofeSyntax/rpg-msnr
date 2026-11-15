// ============================================================
//  AGENTES (login)
//  Só o MESTRE vem de fábrica. Os demais agentes são criados no painel do Mestre.
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
