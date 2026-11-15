import Icon from "../Icon";
import { useDados } from "../../context/DataContext";
import { uid } from "../../utils/formatar";

// Mestre: adiciona, edita e remove os contratos exibidos na Home.
const ContratosMestre = () => {
  const { db, atualizar } = useDados();
  const mudar = (id, p) => atualizar((d) => ({ contratos: d.contratos.map((c) => (c.id === id ? { ...c, ...p } : c)) }));
  return (
    <>
      <p className="intro">Contratos mostrados na seção "Contratos" da página inicial. As alterações são salvas automaticamente.</p>
      {db.contratos.length === 0 && <p className="vazio">Nenhum contrato cadastrado.</p>}
      {db.contratos.map((c) => (
        <div key={c.id} className="form-tarefa">
          <label className="campo campo-largo"><span>Título</span>
            <input value={c.titulo} onChange={(e) => mudar(c.id, { titulo: e.target.value })} />
          </label>
          <label className="campo campo-largo"><span>Texto</span>
            <textarea rows={3} value={c.texto} onChange={(e) => mudar(c.id, { texto: e.target.value })} />
          </label>
          <div className="campo-largo">
            <button type="button" className="btn btn-fantasma btn-mini" onClick={() => window.confirm(`Excluir o contrato "${c.titulo}"?`) && atualizar((d) => ({ contratos: d.contratos.filter((x) => x.id !== c.id) }))}>
              <Icon nome="lixeira" tamanho={14} /> excluir contrato
            </button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-acento" onClick={() => atualizar((d) => ({ contratos: [...d.contratos, { id: uid(), titulo: "NOVO CONTRATO", texto: "" }] }))}>
        <Icon nome="mais" tamanho={16} /> novo contrato
      </button>
    </>
  );
};

export default ContratosMestre;
