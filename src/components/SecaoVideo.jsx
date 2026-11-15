import { useDados } from "../context/DataContext";

// Converte um link em algo que o navegador consiga tocar (YouTube/Vimeo = iframe; resto = <video>)
const lerVideo = (url) => {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return { iframe: `https://www.youtube.com/embed/${yt[1]}` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { iframe: `https://player.vimeo.com/video/${vm[1]}` };
  return { arquivo: url };
};

// Vídeo de boas-vindas (link definido pelo Mestre). Só aparece para quem está logado.
const SecaoVideo = () => {
  const { db } = useDados();
  const url = (db.config.videoUrl || "").trim();
  const v = url && lerVideo(url);

  return (
    <section id="boas-vindas" className="secao">
      <div className="secao-interna">
        <div className="bx">
          <h1>boas-vindas</h1>
          {!v && <p className="vazio">O vídeo de boas-vindas ainda não foi definido pelo Mestre.</p>}
          {v?.iframe && (
            <div className="video-quadro">
              <iframe src={v.iframe} title="Vídeo de boas-vindas" allow="fullscreen; picture-in-picture" allowFullScreen />
            </div>
          )}
          {v?.arquivo && (
            <div className="video-quadro">
              <video src={v.arquivo} controls preload="metadata" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SecaoVideo;
