// Formulário de documento (título, tipo e conteúdo). Usado nas mensagens e no painel do mestre.
// valor: { titulo, tipo, conteudo } | aoMudar(novoValor)
import { enviarImagem } from "../utils/imagens";

const FormDocumento = ({ valor, aoMudar }) => {
  const mudar = (p) => aoMudar({ ...valor, ...p });

  const lerImagem = async (e) => {
    const arq = e.target.files?.[0];
    if (!arq) return;
    try { mudar({ conteudo: await enviarImagem(arq) }); } catch (x) { window.alert(x.message || "Falha ao enviar a imagem."); }
  };

  return (
    <div className="form-doc">
      <label className="campo">
        <span>Título do documento</span>
        <input value={valor.titulo} onChange={(e) => mudar({ titulo: e.target.value })} maxLength={80} />
      </label>
      <label className="campo">
        <span>Tipo</span>
        <select value={valor.tipo} onChange={(e) => mudar({ tipo: e.target.value, conteudo: "" })}>
          <option value="texto">Texto</option>
          <option value="imagem">Imagem</option>
          <option value="link">Link</option>
        </select>
      </label>
      {valor.tipo === "texto" ? (
        <label className="campo campo-largo">
          <span>Texto</span>
          <textarea rows={4} value={valor.conteudo} onChange={(e) => mudar({ conteudo: e.target.value })} />
        </label>
      ) : (
        <>
          <label className="campo campo-largo">
            <span>{valor.tipo === "imagem" ? "URL da imagem" : "URL do link"}</span>
            <input
              value={valor.conteudo.startsWith("data:") ? "(imagem enviada)" : valor.conteudo}
              onChange={(e) => mudar({ conteudo: e.target.value })}
              placeholder="https://..."
            />
          </label>
          {valor.tipo === "imagem" && (
            <label className="campo campo-largo">
              <span>ou enviar arquivo</span>
              <input type="file" accept="image/*" onChange={lerImagem} />
            </label>
          )}
        </>
      )}
    </div>
  );
};

export default FormDocumento;
