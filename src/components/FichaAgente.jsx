import { useState, useEffect, useRef } from "react";
import { ATRIBUTOS, PERICIAS, ATRIBUTO_MAX, TIPOS_SANGUE, STATUS, fichaInicial } from "../data/ficha";
import { gerarCodigo, lerCodigo, exportarImagens, exportarPdf } from "../utils/exportar";
import { useSalvarFicha } from "../utils/fichaStore";
import { useDados } from "../context/DataContext";
import { calcularIdade } from "../utils/formatar";
import "../styles/ficha.css";

const normItens = (l) => (Array.isArray(l) ? l : []).map((x) => (typeof x === "string" ? { nome: x, equipado: false } : x));
const mesclar = (agente, salvo) => {
  const m = { ...fichaInicial(agente), ...salvo };
  return { ...m, inventario: normItens(m.inventario), mochila: normItens(m.mochila) };
};
const Par = ({ rotulo, a, b, onA, onB }) => (
  <label className="ficha-par">
    <span>{rotulo}</span>
    <input type="number" min="0" value={a} onChange={(e) => onA(+e.target.value)} aria-label={`${rotulo} atual`} />
    <i>/</i>
    <input type="number" min="0" value={b} onChange={(e) => onB(+e.target.value)} aria-label={`${rotulo} total`} />
  </label>
);

const Vital = ({ rotulo, a, b, onA, onB, onCura, textoCura, aviso }) => (
  <div className="vital">
    <div className="vital-linha">
      <Par rotulo={rotulo} a={a} b={b} onA={onA} onB={onB} />
      <button type="button" className="btn btn-fantasma btn-mini" onClick={onCura}>{textoCura}</button>
    </div>
    {aviso && (
      <p className={`hp-aviso ${aviso[1]}`} role="status" aria-label={aviso[0]}>
        {[...aviso[0]].map((c, i) => (
          <span key={i} aria-hidden="true" style={{ animationDelay: `${(i % 7) * 0.04}s` }}>{c === " " ? "\u00a0" : c}</span>
        ))}
      </p>
    )}
  </div>
);

const avisoHp = (a, b) => {
  if (!(b > 0)) return null;
  const p = (a / b) * 100;
  if (p < 10) return ["A morte se aproxima a cada passo", "critico"];
  if (p < 25) return ["A resiliência será sua amiga de agora", "baixo"];
  return null;
};

const Radar = ({ atributos }) => {
  const R = 78, C = 100;
  const ponto = (i, f) => {
    const ang = ((-90 + 72 * i) * Math.PI) / 180;
    return [C + Math.cos(ang) * R * f, C + Math.sin(ang) * R * f];
  };
  const poli = (f) => ATRIBUTOS.map((_, i) => ponto(i, f).join(",")).join(" ");
  const dados = ATRIBUTOS.map((at, i) => ponto(i, Math.min(atributos[at.id], ATRIBUTO_MAX) / ATRIBUTO_MAX).join(",")).join(" ");
  return (
    <svg viewBox="0 0 200 200" className="ficha-radar" role="img" aria-label="Gráfico de atributos">
      {[1 / 3, 2 / 3, 1].map((f) => <polygon key={f} points={poli(f)} className="radar-grade" />)}
      {ATRIBUTOS.map((_, i) => <line key={i} x1={C} y1={C} x2={ponto(i, 1)[0]} y2={ponto(i, 1)[1]} className="radar-grade" />)}
      <polygon points={dados} className="radar-area" />
      {ATRIBUTOS.map((at, i) => {
        const [x, y] = ponto(i, 1.17);
        return <text key={at.id} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="radar-rotulo">{at.sigla}</text>;
      })}
    </svg>
  );
};

const Slider = ({ ligado, onClick, rotulo }) => (
  <button type="button" role="switch" aria-checked={ligado} aria-label={rotulo} className={`ficha-slider ${ligado ? "verso" : ""}`} onClick={onClick}><i /></button>
);

// Lista de itens com "Equipar" (equipados sobem para o topo)
const ListaItens = ({ itens, onChange, desativado, max }) => {
  const ordem = itens.map((it, i) => ({ it, i })).sort((x, y) => (y.it.equipado ? 1 : 0) - (x.it.equipado ? 1 : 0));
  const atualiza = (i, p) => onChange(itens.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const cheio = max != null && itens.length >= max;
  return (
    <div className={`lista-ficha ${desativado ? "desativada" : ""}`}>
      {ordem.map(({ it, i }) => (
        <div key={i} className={`item ${it.equipado ? "equipado" : ""}`}>
          <button type="button" className="btn btn-fantasma btn-mini" aria-pressed={!!it.equipado} disabled={desativado} onClick={() => atualiza(i, { equipado: !it.equipado })}>
            {it.equipado ? "Equipado" : "Equipar"}
          </button>
          <input placeholder="Item" value={it.nome} disabled={desativado} onChange={(e) => atualiza(i, { nome: e.target.value })} />
          <button type="button" className="icone-btn" aria-label="Remover item" disabled={desativado} onClick={() => onChange(itens.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <button type="button" className="btn btn-fantasma" disabled={desativado || cheio} onClick={() => onChange([...itens, { nome: "", equipado: false }])}>
        {cheio ? "Inventário cheio" : "+ Item"}
      </button>
    </div>
  );
};

const Frente = ({ f, set }) => {
  const mudaAtaque = (i, k, v) => set({ ataques: f.ataques.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  return (
    <div className="ficha-face">
      <div className="ficha-linha">
        <input className="ficha-titulo" placeholder="Personagem" value={f.personagem} onChange={(e) => set({ personagem: e.target.value })} aria-label="Personagem" />
        <label className="ficha-nivel">Lv.
          <input type="number" min="1" value={f.nivel} onChange={(e) => set({ nivel: +e.target.value })} />
        </label>
      </div>
      <div className="ficha-grade-3">
        <label className="campo"><span>Jogador</span><input value={f.jogador} onChange={(e) => set({ jogador: e.target.value })} /></label>
        <label className="campo"><span>Classe</span><input value={f.classe} onChange={(e) => set({ classe: e.target.value })} /></label>
        <label className="campo"><span>Tipo sanguíneo</span>
          <select value={f.sangue} onChange={(e) => set({ sangue: e.target.value })}>{TIPOS_SANGUE.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label className="campo"><span>Status</span>
          <select value={f.status} onChange={(e) => set({ status: e.target.value })}>{STATUS.map((t) => <option key={t}>{t}</option>)}</select>
          {f.status === "Customizado" && <input className="status-custom" placeholder="Escreva o status" value={f.statusCustom} onChange={(e) => set({ statusCustom: e.target.value })} />}
        </label>
      </div>

      <div className="ficha-topo">
        <section className="ficha-caixa">
          <Vital rotulo="HP" a={f.hpAtual} b={f.hpTotal} onA={(v) => set({ hpAtual: v })} onB={(v) => set({ hpTotal: v })}
            onCura={() => set({ hpAtual: f.hpTotal })} textoCura="Cura total" aviso={avisoHp(f.hpAtual, f.hpTotal)} />
          <Vital rotulo="EN" a={f.energiaAtual} b={f.energiaTotal} onA={(v) => set({ energiaAtual: v })} onB={(v) => set({ energiaTotal: v })}
            onCura={() => set({ energiaAtual: f.energiaTotal })} textoCura="Recarga total" />
          <h3 className="ficha-sub">Estresse</h3>
          <div className="estresse">
            {f.estresse.map((on, i) => (
              <button key={i} type="button" aria-pressed={on} aria-label={`Estresse ${i + 1}`}
                className={`quadrado ${on ? "marcado" : ""}`}
                onClick={() => set({ estresse: f.estresse.map((x, j) => (j === i ? !x : x)) })} />
            ))}
          </div>
        </section>
        <section className="ficha-caixa ficha-atributos">
          <Radar atributos={f.atributos} />
          <div className="atrib-inputs">
            {ATRIBUTOS.map((at) => (
              <label key={at.id} title={at.nome}><span>{at.sigla}</span>
                <input type="number" min="0" max={ATRIBUTO_MAX} value={f.atributos[at.id]}
                  onChange={(e) => set({ atributos: { ...f.atributos, [at.id]: Math.max(0, Math.min(ATRIBUTO_MAX, +e.target.value)) } })} />
              </label>
            ))}
          </div>
        </section>
      </div>

      <h3 className="ficha-sub">Perícias</h3>
      <ul className="pericias">
        {PERICIAS.map(([nome, atr]) => (
          <li key={nome}>
            <input className="bonus" placeholder="±" value={f.bonus[nome] ?? ""} aria-label={`Bônus de ${nome}`}
              onChange={(e) => set({ bonus: { ...f.bonus, [nome]: e.target.value } })} />
            <span><b>{atr.toUpperCase()}</b> {nome}</span>
          </li>
        ))}
      </ul>

      <h3 className="ficha-sub">Ataques</h3>
      <div className="lista-ficha">
        {f.ataques.map((a, i) => (
          <div key={i} className="ataque">
            <input placeholder="Ataque" value={a.nome} onChange={(e) => mudaAtaque(i, "nome", e.target.value)} />
            <input placeholder="Teste (1d20+4)" value={a.teste} onChange={(e) => mudaAtaque(i, "teste", e.target.value)} />
            <input placeholder="Dano (2d6)" value={a.dano} onChange={(e) => mudaAtaque(i, "dano", e.target.value)} />
            <button type="button" className="icone-btn" aria-label="Remover ataque" onClick={() => set({ ataques: f.ataques.filter((_, j) => j !== i) })}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-fantasma" onClick={() => set({ ataques: [...f.ataques, { nome: "", teste: "", dano: "" }] })}>+ Ataque</button>
      </div>
    </div>
  );
};

const Verso = ({ f, set }) => {
  const cheio = f.inventario.length >= f.inventarioMax;
  const pct = Math.min(100, (f.inventario.length / Math.max(1, f.inventarioMax)) * 100);
  const idade = calcularIdade(f.nascimento);
  const mudaRel = (i, k, v) => set({ relacionamentos: f.relacionamentos.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  const mudaHab = (i, k, v) => set({ habilidades: f.habilidades.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });
  return (
    <div className="ficha-face">
      <div className="ficha-linha">
        <input className="ficha-titulo" placeholder="Personagem" value={f.personagem} onChange={(e) => set({ personagem: e.target.value })} aria-label="Personagem" />
      </div>
      <div className="ficha-grade-3">
        <label className="campo"><span>Origem</span><input value={f.origem} onChange={(e) => set({ origem: e.target.value })} /></label>
        <label className="campo campo-inline"><input type="checkbox" className="reab" checked={f.reabilitado} onChange={(e) => set({ reabilitado: e.target.checked })} /><span>Reabilitado</span></label>
      </div>

      <h3 className="ficha-sub">Informações pessoais</h3>
      <div className="ficha-grade-3">
        <label className="campo"><span>Altura (cm)</span><input type="number" min="0" value={f.altura} onChange={(e) => set({ altura: e.target.value })} /></label>
        <label className="campo"><span>Nascimento</span>
          <div className="ficha-nasc">
            <input type="date" value={f.nascimento} onChange={(e) => set({ nascimento: e.target.value })} />
            <span className="idade" aria-live="polite">{idade != null ? `${idade} anos` : "— anos"}</span>
          </div>
        </label>
        <label className="campo"><span>Local de nascimento</span><input value={f.localNascimento} onChange={(e) => set({ localNascimento: e.target.value })} /></label>
      </div>
      <label className="campo ficha-aparencia"><span>Aparência</span>
        <textarea rows="4" placeholder="Descreva a aparência do personagem" value={f.aparencia} onChange={(e) => set({ aparencia: e.target.value })} />
      </label>

      <h3 className="ficha-sub">História (backstory)</h3>
      <textarea rows="8" placeholder="Conte a história do personagem" value={f.backstory} onChange={(e) => set({ backstory: e.target.value })} aria-label="Backstory" />

      <h3 className="ficha-sub">Relacionamentos</h3>
      <div className="lista-ficha">
        {f.relacionamentos.length === 0 && <p className="vazio">Nenhum relacionamento registrado.</p>}
        {f.relacionamentos.map((r, i) => (
          <div key={i} className="relacao">
            <input placeholder="Nome" value={r.nome} onChange={(e) => mudaRel(i, "nome", e.target.value)} />
            <input placeholder="Relação (amigo, rival, família...)" value={r.relacao} onChange={(e) => mudaRel(i, "relacao", e.target.value)} />
            <button type="button" className="icone-btn" aria-label="Remover relacionamento" onClick={() => set({ relacionamentos: f.relacionamentos.filter((_, j) => j !== i) })}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-fantasma" onClick={() => set({ relacionamentos: [...f.relacionamentos, { nome: "", relacao: "" }] })}>+ Relacionamento</button>
      </div>

      <h3 className="ficha-sub">Habilidades</h3>
      <div className="lista-ficha">
        {f.habilidades.length === 0 && <p className="vazio">Nenhuma habilidade registrada.</p>}
        {f.habilidades.map((h, i) => (
          <div key={i} className="habilidade">
            <input placeholder="Nome" value={h.nome} onChange={(e) => mudaHab(i, "nome", e.target.value)} />
            <textarea rows="2" placeholder="Descrição" value={h.descricao} onChange={(e) => mudaHab(i, "descricao", e.target.value)} />
            <button type="button" className="icone-btn" aria-label="Remover habilidade" onClick={() => set({ habilidades: f.habilidades.filter((_, j) => j !== i) })}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-fantasma" onClick={() => set({ habilidades: [...f.habilidades, { nome: "", descricao: "" }] })}>+ Habilidade</button>
      </div>

      <div className="inv-cab">
        <h3 className="ficha-sub">Inventário</h3>
        <div className="inv-barra" role="meter" aria-valuemin="0" aria-valuemax={f.inventarioMax} aria-valuenow={f.inventario.length}>
          <div className={`inv-preenchido ${cheio ? "cheio" : ""}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="codigo">{f.inventario.length}/</span>
        <input className="inv-max" type="number" min="1" value={f.inventarioMax} aria-label="Capacidade máxima" onChange={(e) => set({ inventarioMax: Math.max(1, +e.target.value) })} />
      </div>
      <ListaItens itens={f.inventario} max={f.inventarioMax} onChange={(inventario) => set({ inventario })} />

      <div className="inv-cab">
        <h3 className="ficha-sub">Mochila</h3>
        <span className="codigo">{f.mochilaAtiva ? "ativa" : "desativada: itens guardados e indisponíveis"}</span>
        <Slider ligado={f.mochilaAtiva} rotulo="Ativar ou desativar a mochila" onClick={() => set({ mochilaAtiva: !f.mochilaAtiva })} />
      </div>
      <ListaItens itens={f.mochila} desativado={!f.mochilaAtiva} onChange={(mochila) => set({ mochila })} />
    </div>
  );
};

const FichaAgente = ({ agente }) => {
  const { db } = useDados();
  const salvarFicha = useSalvarFicha();
  const [f, setF] = useState(() => mesclar(agente, db.fichas?.[agente.id]));
  const [verso, setVerso] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [entrada, setEntrada] = useState("");
  const [msg, setMsg] = useState("");
  const capRef = useRef(null);
  const set = (parcial) => setF((atual) => ({ ...atual, ...parcial }));
  const nome = (f.personagem || "ficha").trim().replace(/\s+/g, "_");

  useEffect(() => {
    salvarFicha(agente, f);
  }, [f, agente, salvarFicha]);

  const rodar = async (fn, ok) => {
    try { await fn(); setMsg(ok); } catch (e) { setMsg(`Falha: ${e.message}`); }
  };
  const gerar = async () => {
    const c = gerarCodigo(f);
    setCodigo(c);
    try { await navigator.clipboard.writeText(c); setMsg("Código gerado e copiado."); } catch { setMsg("Código gerado: copie do campo abaixo."); }
  };
  const importar = () => {
    try { setF(mesclar(agente, lerCodigo(entrada))); setEntrada(""); setMsg("Ficha importada."); }
    catch { setMsg("Código inválido: confira se começa com MSNR1."); }
  };

  return (
    <div className="ficha">
      <div className="ficha-lado">
        <span className={verso ? "" : "ativo"}>Frente</span>
        <Slider ligado={verso} rotulo="Alternar frente e verso" onClick={() => setVerso((v) => !v)} />
        <span className={verso ? "ativo" : ""}>Verso</span>
      </div>
      {verso ? <Verso f={f} set={set} /> : <Frente f={f} set={set} />}

      <details className="ficha-export">
        <summary>Exportar e importar</summary>
        <div className="export-botoes">
          <button type="button" className="btn btn-fantasma" onClick={() => rodar(() => exportarImagens([...capRef.current.children], nome), "Imagens geradas (frente e verso).")}>Imagem (PNG)</button>
          <button type="button" className="btn btn-fantasma" onClick={() => rodar(() => exportarPdf(f, nome), "PDF editável gerado.")}>PDF editável</button>
          <button type="button" className="btn btn-fantasma" onClick={gerar}>Gerar código</button>
        </div>
        {codigo && <textarea readOnly rows="3" value={codigo} aria-label="Código de exportação" onFocus={(e) => e.target.select()} />}
        <textarea rows="3" placeholder="Cole aqui um código MSNR1. para importar" value={entrada} onChange={(e) => setEntrada(e.target.value)} />
        <button type="button" className="btn btn-fantasma" disabled={!entrada.trim()} onClick={importar}>Importar código</button>
        {msg && <p className="codigo" role="status">{msg}</p>}
      </details>

      {/* cópia fora da tela usada para gerar as imagens */}
      <div className="ficha-captura" ref={capRef} aria-hidden="true" inert="">
        <Frente f={f} set={() => {}} />
        <Verso f={f} set={() => {}} />
      </div>
    </div>
  );
};

export default FichaAgente;
