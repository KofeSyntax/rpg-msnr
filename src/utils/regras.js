// Regras de quem pode falar com quem (mensagens diretas).
export const ehMestre = (a) => a?.papel === "mestre";
// NPC: login sem ficha editável (o Mestre edita o cartão)
export const ehNpc = (a) => a?.tipo === "npc";
export const ehDiretoria = (a) => ehMestre(a) || (a?.nivel ?? 0) >= 5;
// "a" é mentor da equipe de "b"?
export const mentorDe = (db, a, b) =>
  !!a && !!b && !!b.equipe && db.equipes.some((e) => e.mentor === a.id && e.nome === b.equipe);

export const amigosDe = (db, id) =>
  db.amizades
    .filter((x) => x.status === "aceita" && (x.de === id || x.para === id))
    .map((x) => (x.de === id ? x.para : x.de));

const temConversa = (db, a, b) =>
  db.mensagens.some((m) => (m.de === a && m.para === b) || (m.de === b && m.para === a));

// Diretoria/mestre falam com qualquer agente existente; mentor fala com a própria equipe;
// os demais precisam de amizade aceita. Quem recebeu mensagem de diretoria/mentor pode responder.
export const podeMensagem = (db, de, para) => {
  if (!de || !para || de.id === para.id) return false;
  if (ehDiretoria(de) || mentorDe(db, de, para)) return true;
  if (amigosDe(db, de.id).includes(para.id)) return true;
  return (ehDiretoria(para) || mentorDe(db, para, de)) && temConversa(db, de.id, para.id);
};
