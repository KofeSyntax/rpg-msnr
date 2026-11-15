import Icon from "../Icon";
import { useDados } from "../../context/DataContext";

// Mestre: textos fixos do site (aviso da Home, "Sobre" e introdução da Corporação).
const TextosMestre = () => {
  const { db, atualizar } = useDados();
  const c = db.config;
  const set = (p) => atualizar((d) => ({ config: { ...d.config, ...p } }));
  return (
    <>
      <h2 className="subtitulo">Textos do site</h2>
      <div className="form-tarefa">
        <label className="campo campo-largo"><span>Aviso da Home: título</span>
          <input value={c.alerta.titulo} onChange={(e) => set({ alerta: { ...c.alerta, titulo: e.target.value } })} /></label>
        <label className="campo campo-largo"><span>Aviso da Home: texto</span>
          <textarea rows={3} value={c.alerta.corpo} onChange={(e) => set({ alerta: { ...c.alerta, corpo: e.target.value } })} /></label>
        {c.sobre.map((p, i) => (
          <label key={i} className="campo campo-largo"><span>Sobre: parágrafo {i + 1}</span>
            <textarea rows={5} value={p} onChange={(e) => set({ sobre: c.sobre.map((x, j) => (j === i ? e.target.value : x)) })} />
            <button type="button" className="btn btn-fantasma btn-mini" onClick={() => set({ sobre: c.sobre.filter((_, j) => j !== i) })}>remover parágrafo</button>
          </label>
        ))}
        <div className="campo-largo">
          <button type="button" className="btn btn-fantasma btn-mini" onClick={() => set({ sobre: [...c.sobre, ""] })}><Icon nome="mais" tamanho={14} /> parágrafo em "Sobre"</button>
        </div>
        <label className="campo campo-largo"><span>Introdução da aba Corporação</span>
          <textarea rows={3} value={c.corporacaoIntro} onChange={(e) => set({ corporacaoIntro: e.target.value })} /></label>
      </div>
    </>
  );
};

export default TextosMestre;
