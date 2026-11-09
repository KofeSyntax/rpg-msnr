import Icon from "../Icon";
import CampoImagem from "../CampoImagem";
import { useDados } from "../../context/DataContext";
import { uid } from "../../utils/formatar";

const Campo = ({ rotulo, largo, children }) => (
  <label className={`campo ${largo ? "campo-largo" : ""}`}><span>{rotulo}</span>{children}</label>
);
const MEMBRO_NOVO = { cargo: "Novo cargo", nome: "", setor: "", nivel: 1, foto: "", descricao: "" };

// Mestre: edita camadas (diretoria, divisões...) e os membros de cada uma.
const CorporacaoMestre = () => {
  const { db, atualizar } = useDados();
  const grupo = (id, fn) => atualizar((d) => ({ corporacao: d.corporacao.map((g) => (g.id === id ? fn(g) : g)) }));
  const membro = (id, i, p) => grupo(id, (g) => ({ ...g, membros: g.membros.map((m, j) => (j === i ? { ...m, ...p } : m)) }));
  return (
    <>
      {db.corporacao.map((g) => (
        <div key={g.id} className="camada">
          <div className="form-tarefa">
            <Campo rotulo="Nome da camada / divisão" largo>
              <input value={g.camada} onChange={(e) => grupo(g.id, (x) => ({ ...x, camada: e.target.value }))} />
            </Campo>
          </div>
          {g.membros.map((m, i) => (
            <div key={i} className="form-tarefa">
              <Campo rotulo="Cargo"><input value={m.cargo} onChange={(e) => membro(g.id, i, { cargo: e.target.value })} /></Campo>
              <Campo rotulo="Nome"><input value={m.nome} onChange={(e) => membro(g.id, i, { nome: e.target.value })} /></Campo>
              <Campo rotulo="Setor"><input value={m.setor} onChange={(e) => membro(g.id, i, { setor: e.target.value })} /></Campo>
              <Campo rotulo="Nível (0 a 5)"><input type="number" min="0" max="5" value={m.nivel} onChange={(e) => membro(g.id, i, { nivel: +e.target.value })} /></Campo>
              <Campo rotulo="Foto" largo><CampoImagem valor={m.foto} onChange={(foto) => membro(g.id, i, { foto })} /></Campo>
              <Campo rotulo="Descrição" largo><textarea rows={3} value={m.descricao} onChange={(e) => membro(g.id, i, { descricao: e.target.value })} /></Campo>
              <div className="campo-largo">
                <button type="button" className="btn btn-fantasma btn-mini" onClick={() => window.confirm(`Remover ${m.nome || m.cargo}?`) && grupo(g.id, (x) => ({ ...x, membros: x.membros.filter((_, j) => j !== i) }))}>
                  <Icon nome="lixeira" tamanho={14} /> remover membro
                </button>
              </div>
            </div>
          ))}
          <div className="acoes-linha">
            <button type="button" className="btn btn-acento btn-mini" onClick={() => grupo(g.id, (x) => ({ ...x, membros: [...x.membros, { ...MEMBRO_NOVO }] }))}>
              <Icon nome="mais" tamanho={14} /> novo membro
            </button>
            <button type="button" className="btn btn-fantasma btn-mini" onClick={() => window.confirm(`Excluir a camada "${g.camada}" e todos os membros?`) && atualizar((d) => ({ corporacao: d.corporacao.filter((x) => x.id !== g.id) }))}>
              excluir camada
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-acento" onClick={() => atualizar((d) => ({ corporacao: [...d.corporacao, { id: uid(), camada: "Nova camada", membros: [] }] }))}>
        <Icon nome="mais" tamanho={16} /> nova camada
      </button>
    </>
  );
};

export default CorporacaoMestre;
