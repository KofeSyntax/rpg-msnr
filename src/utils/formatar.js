// Funções auxiliares pequenas usadas em vários componentes.

// "2026-11-06" -> "06/11/2026"
export const formatarData = (iso) => {
  if (!iso) return "—";
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
};

// Data de hoje no formato AAAA-MM-DD (fuso local)
export const hojeISO = () => {
  const d = new Date();
  const dois = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${dois(d.getMonth() + 1)}-${dois(d.getDate())}`;
};

// "Helena Vasconcellos Prado" -> "HV"
export const iniciais = (nome = "") =>
  nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

// Imagem usada quando uma foto da web não carrega
const SVG_SEM_IMAGEM =
  "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='420'><rect width='100%' height='100%' fill='#1b1b1b'/><text x='50%' y='50%' fill='#8a8a8a' font-family='monospace' font-size='22' text-anchor='middle'>[IMAGEM EXPURGADA]</text></svg>";

const SEM_IMAGEM = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  SVG_SEM_IMAGEM
)}`;

export const trocarPorPlaceholder = (evento) => {
  evento.currentTarget.onerror = null;
  evento.currentTarget.src = SEM_IMAGEM;
};

// Id único simples (mensagens, anotações, documentos...)
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

// "2026-11-07T12:30:00Z" -> "07/11/26 09:30"
export const formatarHora = (iso) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "";

// Idade a partir de AAAA-MM-DD (null se a data for inválida)
export const calcularIdade = (iso) => {
  if (!iso) return null;
  const [a, m, d] = iso.split("-").map(Number);
  if (!a || !m || !d) return null;
  const h = new Date();
  let idade = h.getFullYear() - a;
  if (h.getMonth() + 1 < m || (h.getMonth() + 1 === m && h.getDate() < d)) idade--;
  return idade >= 0 ? idade : null;
};

// ISO <-> valor de <input type="datetime-local"> (horário local)
export const paraInputLocal = (iso) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
export const deInputLocal = (v) => new Date(v).toISOString();
