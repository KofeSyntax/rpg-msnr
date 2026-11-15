import { supabase, temSupabase } from "../lib/supabase";

const reduzir = (arq, max = 1400) =>
  new Promise((ok) => {
    const img = new Image();
    const url = URL.createObjectURL(arq);
    img.onload = () => {
      const e = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * e); c.height = Math.round(img.height * e);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob((b) => ok(b || arq), "image/jpeg", 0.85);
    };
    img.onerror = () => ok(arq);
    img.src = url;
  });

const comoDataUrl = (blob) =>
  new Promise((ok, falha) => { const l = new FileReader(); l.onload = () => ok(l.result); l.onerror = falha; l.readAsDataURL(blob); });

// Envia a imagem ao Storage do Supabase e devolve a URL pública
// (sem Supabase configurado, devolve a imagem embutida como texto).
export const enviarImagem = async (arq) => {
  if (!arq?.type?.startsWith("image/")) throw new Error("Escolha um arquivo de imagem.");
  const manter = arq.type === "image/gif" || arq.type === "image/svg+xml";
  const blob = manter ? arq : await reduzir(arq);
  if (!temSupabase) {
    if (blob.size > 400 * 1024) throw new Error("Sem Supabase, a imagem deve ter até 400 KB.");
    return comoDataUrl(blob);
  }
  const ext = blob.type === "image/jpeg" ? "jpg" : (arq.name.split(".").pop() || "png").toLowerCase();
  const caminho = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("imagens").upload(caminho, blob, { contentType: blob.type, cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from("imagens").getPublicUrl(caminho).data.publicUrl;
};
