// Camada de sincronização: cada item de cada coleção é uma linha da tabela "colecoes".
import { supabase } from "./supabase";

export const CLIENTE = Math.random().toString(36).slice(2); // identifica esta aba (ignora o próprio eco)
export const COLECOES = {
  agentes: ["lista", "id"], equipes: ["lista", "nome"], missoes: ["lista", "id"],
  documentos: ["lista", "id"], entidades: ["lista", "id"], banco: ["lista", "id"],
  contratos: ["lista", "id"], corporacao: ["lista", "id"],
  mensagens: ["lista", "id"], amizades: ["lista", "id"],
  notas: ["mapa"], fichas: ["mapa"], config: ["objeto"],
};

const ordens = new Map(); // "colecao:id" -> ordem (mantém a ordem das listas)
let seq = 0;
const igual = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);

// valor da coleção -> Map(id -> dados)
const itens = (col, valor) => {
  const [tipo, chave] = COLECOES[col];
  if (tipo === "lista") return new Map((valor || []).map((x) => [String(x[chave]), x]));
  if (tipo === "mapa") return new Map(Object.entries(valor || {}));
  return new Map(valor === undefined ? [] : [["unico", valor]]);
};

const montar = (col, linhas, padrao) => {
  const [tipo] = COLECOES[col];
  if (tipo === "lista") return [...linhas].sort((a, b) => a.ordem - b.ordem).map((l) => l.dados);
  if (tipo === "mapa") return Object.fromEntries(linhas.map((l) => [l.id, l.dados]));
  return { ...padrao, ...(linhas[0]?.dados || {}) };
};

// ---------- fila de gravação (agrupa digitação rápida) ----------
const pendentes = new Map();
let timer = null;
let aoErro = () => {};
export const definirAoErro = (fn) => { aoErro = fn; };

export const gravar = (antes, depois) => {
  for (const col of Object.keys(COLECOES)) {
    if (antes[col] === depois[col]) continue;
    const a = itens(col, antes[col]);
    const b = itens(col, depois[col]);
    for (const [id, d] of b) if (!a.has(id) || !igual(a.get(id), d)) pendentes.set(`${col}:${id}`, { col, id, dados: d });
    for (const id of a.keys()) if (!b.has(id)) pendentes.set(`${col}:${id}`, { col, id, dados: null });
  }
  if (pendentes.size) { clearTimeout(timer); timer = setTimeout(descarregar, 500); }
};

export const descarregar = async () => {
  clearTimeout(timer);
  const lote = [...pendentes.values()];
  pendentes.clear();
  if (!lote.length) return;
  try {
    const subir = lote.filter((x) => x.dados !== null).map(({ col, id, dados }) => {
      const k = `${col}:${id}`;
      if (!ordens.has(k)) ordens.set(k, Date.now() * 1000 + (seq++ % 1000));
      return { colecao: col, id, dados, ordem: ordens.get(k), cliente: CLIENTE, atualizado_em: new Date().toISOString() };
    });
    for (let i = 0; i < subir.length; i += 200) {
      const { error } = await supabase.from("colecoes").upsert(subir.slice(i, i + 200));
      if (error) throw error;
    }
    const apagar = {};
    lote.filter((x) => x.dados === null).forEach((x) => (apagar[x.col] ||= []).push(x.id));
    for (const [col, ids] of Object.entries(apagar)) {
      const { error } = await supabase.from("colecoes").delete().eq("colecao", col).in("id", ids);
      if (error) throw error;
    }
    aoErro("");
  } catch (e) {
    lote.forEach((x) => { if (!pendentes.has(`${x.col}:${x.id}`)) pendentes.set(`${x.col}:${x.id}`, x); });
    aoErro(e.message || "falha ao salvar");
    timer = setTimeout(descarregar, 5000); // tenta de novo
  }
};

// ---------- leitura inicial (cria os dados de exemplo na primeira vez) ----------
export const carregarTudo = async (padroes) => {
  const linhas = [];
  for (let i = 0; ; i += 1000) {
    const { data, error } = await supabase.from("colecoes").select("colecao,id,dados,ordem")
      .order("colecao").order("id").range(i, i + 999);
    if (error) throw error;
    linhas.push(...data);
    if (data.length < 1000) break;
  }
  const meta = new Set(linhas.filter((l) => l.colecao === "_meta").map((l) => l.id));
  const db = {};
  const semear = {};
  for (const col of Object.keys(COLECOES)) {
    if (!meta.has(col)) {
      db[col] = padroes[col];
      semear[col] = padroes[col];
      itens(col, padroes[col]).forEach((_, id) => ordens.set(`${col}:${id}`, ordens.size));
      continue;
    }
    const mine = linhas.filter((l) => l.colecao === col);
    mine.forEach((l) => ordens.set(`${col}:${l.id}`, l.ordem));
    db[col] = montar(col, mine, padroes[col]);
  }
  const novas = Object.keys(semear);
  if (novas.length) {
    gravar({}, semear);
    await descarregar();
    const { error } = await supabase.from("colecoes").upsert(novas.map((c) => ({ colecao: "_meta", id: c, dados: {}, cliente: CLIENTE })));
    if (error) throw error;
  }
  return db;
};

// ---------- tempo real ----------
export const assinar = (aoLinha) => {
  const canal = supabase.channel("msnr-colecoes")
    .on("postgres_changes", { event: "*", schema: "public", table: "colecoes" }, (p) => {
      const apagou = p.eventType === "DELETE";
      const l = apagou ? p.old : p.new;
      if (!COLECOES[l.colecao] || (!apagou && l.cliente === CLIENTE)) return;
      if (!apagou) ordens.set(`${l.colecao}:${l.id}`, l.ordem);
      aoLinha(apagou, l);
    })
    .subscribe();
  return () => supabase.removeChannel(canal);
};

// aplica uma linha remota ao db local (sem regravar)
export const aplicarLinha = (db, apagou, l, padroes) => {
  const col = l.colecao;
  const [tipo, chave] = COLECOES[col];
  if (tipo === "lista") {
    const lista = db[col] || [];
    const i = lista.findIndex((x) => String(x[chave]) === l.id);
    if (apagou) return { ...db, [col]: lista.filter((_, j) => j !== i) };
    return { ...db, [col]: i >= 0 ? lista.map((x, j) => (j === i ? l.dados : x)) : [...lista, l.dados] };
  }
  if (tipo === "mapa") {
    const m = { ...(db[col] || {}) };
    if (apagou) delete m[l.id]; else m[l.id] = l.dados;
    return { ...db, [col]: m };
  }
  return apagou ? db : { ...db, [col]: { ...padroes[col], ...l.dados } };
};
