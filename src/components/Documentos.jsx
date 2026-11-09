import { useState } from "react";
import Icon from "./Icon";
import VisorDocumento from "./VisorDocumento";
import { useDados } from "../context/DataContext";
import { formatarHora } from "../utils/formatar";

// Aba "Arquivos": documentos, imagens e textos enviados pelo mestre (ou adicionados de mensagens).
const Documentos = ({ agente }) => {
  const { db, atualizar } = useDados();
  const [aberto, setAberto] = useState(null);
  const meus = db.documentos.filter((d) => d.dono === agente.id).sort((a, b) => b.data.localeCompare(a.data));
  const nome = (id) => db.agentes.find((a) => a.id === id)?.nome || id;
  const excluir = (id) => atualizar((d) => ({ documentos: d.documentos.filter((x) => x.id !== id) }));

  return (
    <section className="arquivos">
      <p className="contagem">{meus.length} {meus.length === 1 ? "documento" : "documentos"}</p>
      {meus.length === 0 && <p className="vazio">Nenhum documento recebido ainda.</p>}
      <ul className="lista-docs">
        {meus.map((d) => (
          <li key={d.id} className="doc">
            <button type="button" className="doc-cab" onClick={() => setAberto(aberto === d.id ? null : d.id)} aria-expanded={aberto === d.id}>
              <strong>{d.titulo}</strong>
              <span className="codigo">{d.tipo} · de {nome(d.de)} · {formatarHora(d.data)}</span>
            </button>
            <button type="button" className="icone-btn" aria-label="Excluir documento" onClick={() => excluir(d.id)}>
              <Icon nome="lixeira" tamanho={18} />
            </button>
            {aberto === d.id && <div className="doc-corpo"><VisorDocumento doc={d} /></div>}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Documentos;
