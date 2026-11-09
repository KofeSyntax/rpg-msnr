import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import Icon from "../components/Icon";
import FormDocumento from "../components/FormDocumento";
import VisorDocumento from "../components/VisorDocumento";
import { useAuth } from "../context/AuthContext";
import { useDados } from "../context/DataContext";
import { amigosDe, podeMensagem, ehDiretoria, mentorDe } from "../utils/regras";
import { formatarHora, uid } from "../utils/formatar";

const ANEXO_VAZIO = { titulo: "", tipo: "texto", conteudo: "" };

// Rota: /mensagens — mensagens diretas, amigos e pedidos de amizade.
const Mensagens = () => {
  const { agente } = useAuth();
  const { db, atualizar } = useDados();
  const location = useLocation();
  const eu = agente.id;
  const [ativo, setAtivo] = useState(location.state?.com || null);
  const [idBusca, setIdBusca] = useState("");
  const [aviso, setAviso] = useState("");
  const [texto, setTexto] = useState("");
  const [anexo, setAnexo] = useState(null);

  useEffect(() => { if (location.state?.com) setAtivo(location.state.com); }, [location.state]);

  const agentePorId = (id) => db.agentes.find((a) => a.id === id);
  const amigos = amigosDe(db, eu);
  const comConversa = db.mensagens.filter((m) => m.de === eu || m.para === eu).map((m) => (m.de === eu ? m.para : m.de));
  const conversas = [...new Set([...amigos, ...comConversa, ...(ativo ? [ativo] : [])])].filter(agentePorId);
  const recebidos = db.amizades.filter((x) => x.para === eu && x.status === "pendente");
  const enviados = db.amizades.filter((x) => x.de === eu && x.status === "pendente");

  const outro = agentePorId(ativo);
  const liberado = podeMensagem(db, agente, outro);
  const fio = db.mensagens.filter((m) => (m.de === eu && m.para === ativo) || (m.de === ativo && m.para === eu));

  const buscar = (e) => {
    e.preventDefault();
    const alvo = db.agentes.find((a) => a.id.toLowerCase() === idBusca.trim().toLowerCase());
    setIdBusca("");
    if (!alvo) return setAviso("Agente não encontrado.");
    if (alvo.id === eu) return setAviso("Esse ID é o seu.");
    // Diretoria/mestre (ou mentor da equipe) conversam direto; amigos também
    if (ehDiretoria(agente) || mentorDe(db, agente, alvo) || amigos.includes(alvo.id)) {
      setAviso("");
      return setAtivo(alvo.id);
    }
    if (db.amizades.some((x) => x.status === "pendente" && ((x.de === eu && x.para === alvo.id) || (x.de === alvo.id && x.para === eu)))) {
      return setAviso("Já existe um pedido pendente com esse agente.");
    }
    atualizar((d) => ({ amizades: [...d.amizades, { id: uid(), de: eu, para: alvo.id, status: "pendente" }] }));
    setAviso(`Pedido de amizade enviado a ${alvo.nome}.`);
  };

  const responder = (id, aceitar) =>
    atualizar((d) => ({
      amizades: aceitar
        ? d.amizades.map((x) => (x.id === id ? { ...x, status: "aceita" } : x))
        : d.amizades.filter((x) => x.id !== id),
    }));

  const enviar = (e) => {
    e.preventDefault();
    const anexoOk = anexo && anexo.titulo.trim() && anexo.conteudo.trim() ? { ...anexo, titulo: anexo.titulo.trim() } : null;
    if (!liberado || (!texto.trim() && !anexoOk)) return;
    const m = { id: uid(), de: eu, para: ativo, texto: texto.trim(), anexo: anexoOk, data: new Date().toISOString(), adicionado: false };
    atualizar((d) => ({ mensagens: [...d.mensagens, m] }));
    setTexto("");
    setAnexo(null);
  };

  // "Adicionar documento": copia o anexo recebido para a aba Arquivos do agente
  const adicionarDoc = (m) =>
    atualizar((d) => ({
      documentos: [...d.documentos, { id: uid(), dono: eu, ...m.anexo, de: m.de, data: m.data }],
      mensagens: d.mensagens.map((x) => (x.id === m.id ? { ...x, adicionado: true } : x)),
    }));

  return (
    <>
      <Banner compacto />
      <section className="pagina">
        <h1 className="titulo-pagina">Mensagens</h1>
        <div className="msg-layout">
          <aside className="msg-lateral">
            <form onSubmit={buscar} className="msg-busca">
              <label className="campo">
                <span>Adicionar agente / abrir conversa (ID)</span>
                <input value={idBusca} onChange={(e) => setIdBusca(e.target.value)} placeholder="EXP-0000" />
              </label>
              <button type="submit" className="btn btn-acento" disabled={!idBusca.trim()}>
                {ehDiretoria(agente) ? "abrir" : "enviar pedido"}
              </button>
            </form>
            {aviso && <p className="aviso" role="status">{aviso}</p>}

            {recebidos.length > 0 && (
              <>
                <h3 className="msg-titulo">Pedidos recebidos</h3>
                <ul className="msg-lista">
                  {recebidos.map((x) => (
                    <li key={x.id}>
                      <span>{agentePorId(x.de)?.nome || x.de}</span>
                      <span>
                        <button type="button" className="btn btn-acento btn-mini" onClick={() => responder(x.id, true)}>aceitar</button>{" "}
                        <button type="button" className="btn btn-fantasma btn-mini" onClick={() => responder(x.id, false)}>recusar</button>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {enviados.length > 0 && (
              <>
                <h3 className="msg-titulo">Pedidos enviados</h3>
                <ul className="msg-lista">
                  {enviados.map((x) => (
                    <li key={x.id}>
                      <span>{agentePorId(x.para)?.nome || x.para}</span>
                      <span className="codigo">pendente</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="msg-titulo">Conversas</h3>
            {conversas.length === 0 && <p className="vazio">Nenhuma conversa. Adicione um agente pelo ID.</p>}
            <ul className="msg-lista">
              {conversas.map((id) => (
                <li key={id}>
                  <button type="button" className={`msg-contato ${id === ativo ? "ativa" : ""}`} onClick={() => setAtivo(id)}>
                    <strong>{agentePorId(id).nome}</strong>
                    <span className="codigo">{id}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <div className="msg-fio">
            {!outro ? (
              <p className="vazio">Selecione uma conversa.</p>
            ) : (
              <>
                <header className="msg-cab">
                  <strong>{outro.nome}</strong> <span className="codigo">{outro.id}</span>
                </header>
                <div className="msg-historico">
                  {fio.length === 0 && <p className="vazio">Nenhuma mensagem ainda.</p>}
                  {fio.map((m) => (
                    <article key={m.id} className={`msg ${m.de === eu ? "minha" : ""}`}>
                      {m.texto && <p>{m.texto}</p>}
                      {m.anexo && (
                        <div className="msg-anexo">
                          <p className="codigo"><Icon nome="escudo" tamanho={12} /> Documento: {m.anexo.titulo}</p>
                          <VisorDocumento doc={m.anexo} />
                          {m.para === eu && (
                            <button type="button" className="btn btn-fantasma btn-mini" disabled={m.adicionado} onClick={() => adicionarDoc(m)}>
                              {m.adicionado ? "Adicionado aos arquivos" : "Adicionar documento"}
                            </button>
                          )}
                        </div>
                      )}
                      <span className="codigo">{formatarHora(m.data)}</span>
                    </article>
                  ))}
                </div>

                {liberado ? (
                  <form className="msg-form" onSubmit={enviar}>
                    <textarea rows={2} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva sua mensagem" />
                    {anexo && <FormDocumento valor={anexo} aoMudar={setAnexo} />}
                    <div className="form-acoes">
                      <button type="submit" className="btn btn-acento">enviar</button>
                      <button type="button" className="btn btn-fantasma" onClick={() => setAnexo(anexo ? null : ANEXO_VAZIO)}>
                        {anexo ? "remover documento" : "anexar documento"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="aviso">Vocês precisam ser amigos para conversar. Envie um pedido de amizade pelo ID.</p>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Mensagens;
