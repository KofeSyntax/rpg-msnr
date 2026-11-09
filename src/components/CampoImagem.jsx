import { useState } from "react";
import { enviarImagem } from "../utils/imagens";

// Campo de imagem: cole uma URL ou envie um arquivo (vai para o Supabase Storage).
const CampoImagem = ({ valor, onChange }) => {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const enviar = async (e) => {
    const arq = e.target.files?.[0];
    e.target.value = "";
    if (!arq) return;
    setEnviando(true); setErro("");
    try { onChange(await enviarImagem(arq)); } catch (x) { setErro(x.message || "Falha no envio."); }
    setEnviando(false);
  };
  return (
    <div className="campo-imagem">
      <input value={valor?.startsWith("data:") ? "(imagem embutida)" : valor || ""} readOnly={valor?.startsWith("data:")} onChange={(e) => onChange(e.target.value)} placeholder="https://... ou envie um arquivo" />
      <label className="btn btn-fantasma btn-mini">{enviando ? "Enviando…" : "Enviar arquivo"}
        <input type="file" accept="image/*" hidden disabled={enviando} onChange={enviar} />
      </label>
      {valor && <button type="button" className="btn btn-fantasma btn-mini" onClick={() => onChange("")}>limpar</button>}
      {erro && <span className="codigo" role="alert">{erro}</span>}
    </div>
  );
};

export default CampoImagem;
