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

// Vazio: o Mestre cadastra as entidades pelo painel.
export const ENTIDADES = [];

export default ENTIDADES;
