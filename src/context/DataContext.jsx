import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { AGENTES } from "../data/agentes";
import { EQUIPES } from "../data/equipes";
import { MISSOES } from "../data/missoes";
import { DOCUMENTOS } from "../data/documentos";
import { ENTIDADES } from "../data/entidades";
import { BANCO } from "../data/banco";
import { CORPORACAO } from "../data/corporacao";
import { SITE } from "../data/site";
import { temSupabase } from "../lib/supabase";
import { carregarTudo, gravar, descarregar, assinar, aplicarLinha, definirAoErro, temPendentes } from "../lib/sync";

// Banco de dados do site. Com as variáveis do Supabase configuradas, tudo é salvo lá
// (e atualiza em tempo real para todos). Sem elas, cai no localStorage (modo local).
const CHAVE_LOCAL = "msnr:db:v3";

const semente = () => ({
  agentes: AGENTES,
  equipes: EQUIPES,
  missoes: MISSOES,
  documentos: DOCUMENTOS,
  entidades: ENTIDADES,
  banco: BANCO,
  contratos: SITE.contratos.map((c, i) => ({ id: `ct-${i + 1}`, ...c })),
  corporacao: CORPORACAO.map((g, i) => ({ id: `corp-${i + 1}`, ...g })),
  config: {
    videoUrl: SITE.videoBoasVindas, unidades: SITE.unidades,
    alerta: SITE.alerta, sobre: SITE.sobre, corporacaoIntro: SITE.corporacaoIntro,
  },
  mensagens: [], // { id, de, para, texto, anexo, data, adicionado }
  amizades: [], // { id, de, para, status }
  notas: {}, // { [idAgente]: [{ id, titulo, texto, data }] }
  fichas: {}, // { [idAgente]: ficha }
});

const lerLocal = () => {
  try {
    const s = window.localStorage.getItem(CHAVE_LOCAL);
    if (s) return { ...semente(), ...JSON.parse(s) };
  } catch { /* ignora */ }
  return semente();
};

// Dados antigos (versão que só usava o navegador), para migrar com um clique
const lerAntigo = () => {
  try {
    const s = window.localStorage.getItem("msnr:db:v2");
    const velho = s ? JSON.parse(s) : {};
    const fichas = {};
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k?.startsWith("msnr:ficha:")) fichas[k.slice(11)] = JSON.parse(window.localStorage.getItem(k));
    }
    return { ...velho, fichas };
  } catch { return null; }
};

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [db, setDb] = useState(() => (temSupabase ? null : lerLocal()));
  const [erro, setErro] = useState("");
  const [erroSalvar, setErroSalvar] = useState("");
  const [tentativa, setTentativa] = useState(0);
  const dbRef = useRef(db);

  useEffect(() => {
    if (!temSupabase) return undefined;
    let ativo = true;
    let parar = () => {};
    definirAoErro(setErroSalvar);
    carregarTudo(semente())
      .then((dados) => {
        if (!ativo) return;
        dbRef.current = dados; setDb(dados); setErro("");
        parar = assinar((apagou, linha) => {
          dbRef.current = aplicarLinha(dbRef.current, apagou, linha, semente());
          setDb(dbRef.current);
        });
      })
      .catch((e) => ativo && setErro(e.message || "Não foi possível conectar ao Supabase."));
    const sair = () => descarregar();
    const avisar = (e) => { if (temPendentes()) { e.preventDefault(); e.returnValue = ""; } };
    const oculta = () => { if (document.visibilityState === "hidden") descarregar(); };
    window.addEventListener("pagehide", sair);
    window.addEventListener("beforeunload", avisar);
    document.addEventListener("visibilitychange", oculta);
    return () => {
      ativo = false; parar();
      window.removeEventListener("pagehide", sair); window.removeEventListener("beforeunload", avisar);
      document.removeEventListener("visibilitychange", oculta);
    };
  }, [tentativa]);

  // Modo local: outra aba alterou os dados
  useEffect(() => {
    if (temSupabase) return undefined;
    const aoMudar = (e) => { if (e.key === CHAVE_LOCAL) { const n = lerLocal(); dbRef.current = n; setDb(n); } };
    window.addEventListener("storage", aoMudar);
    return () => window.removeEventListener("storage", aoMudar);
  }, []);

  // atualizar((d) => ({ campo: novoValor })) — mescla o retorno no banco e salva
  const atualizar = useCallback((fn) => {
    const antes = dbRef.current;
    const depois = { ...antes, ...fn(antes) };
    dbRef.current = depois;
    setDb(depois);
    if (temSupabase) gravar(antes, depois);
    else { try { window.localStorage.setItem(CHAVE_LOCAL, JSON.stringify(depois)); } catch { /* ignora */ } }
  }, []);

  const reiniciar = useCallback(() => atualizar(() => semente()), [atualizar]);
  // Copia para o Supabase o que estava salvo só neste navegador (versão antiga do site)
  const importarDoNavegador = useCallback(() => {
    const velho = lerAntigo();
    if (!velho || !velho.agentes) return false;
    atualizar((d) => ({ ...semente(), ...velho, contratos: d.contratos, corporacao: d.corporacao, config: { ...d.config, ...(velho.config || {}) } }));
    return true;
  }, [atualizar]);

  if (!db) {
    return (
      <section className="pagina">
        {erro ? (
          <p className="aviso" role="alert">Falha ao conectar: {erro}{" "}
            <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setTentativa((t) => t + 1)}>tentar de novo</button>
          </p>
        ) : <p className="vazio">Conectando aos arquivos da Fundação…</p>}
      </section>
    );
  }

  return (
    <DataContext.Provider value={{ db, atualizar, reiniciar, importarDoNavegador, erroSalvar, remoto: temSupabase }}>
      {erroSalvar && (
        <p role="alert" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 300, margin: 0, padding: "10px 16px", background: "#8a0a0a", color: "#fff", textAlign: "center" }}>
          ATENÇÃO: as alterações NÃO estão sendo salvas no Supabase ({erroSalvar}). Não feche esta página.
        </p>
      )}
      {children}
    </DataContext.Provider>
  );
};

export const useDados = () => useContext(DataContext);
export default DataContext;
