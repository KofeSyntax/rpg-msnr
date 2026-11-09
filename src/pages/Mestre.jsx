import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import Icon from "../components/Icon";
import FichaAgente from "../components/FichaAgente";
import FormDocumento from "../components/FormDocumento";
import { useAuth } from "../context/AuthContext";
import { useDados } from "../context/DataContext";
import { STATUS_MISSAO } from "../data/missoes";
import { CONTENCAO } from "../data/entidades";
import { AMEACAS, STATUS_BANCO } from "../data/banco";
import { TIPOS_SANGUE } from "../data/ficha";
import { NIVEIS } from "../data/abas";
import { ehMestre, ehNpc } from "../utils/regras";
import { uid, hojeISO, formatarData, formatarHora, paraInputLocal, deInputLocal } from "../utils/formatar";
import CampoImagem from "../components/CampoImagem";
import ContratosMestre from "../components/mestre/ContratosMestre";
import CorporacaoMestre from "../components/mestre/CorporacaoMestre";
import TextosMestre from "../components/mestre/TextosMestre";

const SUBABAS = [["agentes", "Agentes"], ["equipes", "Equipes"], ["missoes", "Missões"], ["documentos", "Documentos"], ["entidades", "Entidades"], ["banco", "Banco de Dados"], ["contratos", "Contratos"], ["corporacao", "Corporação"], ["mensagens", "Mensagens"], ["site", "Site"]];

const Campo = ({ rotulo, largo, children }) => (
  <label className={`campo ${largo ? "campo-largo" : ""}`}><span>{rotulo}</span>{children}</label>
);

// ---------------- Agentes ----------------
const AGENTE_VAZIO = { id: "", senha: "", tipo: "jogador", nome: "", cargo: "", nivel: 1, equipe: "", foto: "", tipoSanguineo: "O+", dataNascimento: "", localNascimento: "", classe: "", altura: "" };

const AgentesMestre = () => {
  const { db, atualizar } = useDados();
  const { agente: eu } = useAuth();
  const navigate = useNavigate();
  const [ed, setEd] = useState(null); // { novo, dados }
  const [erro, setErro] = useState("");
  const [fichaDe, setFichaDe] = useState(null);
  const mud = (p) => setEd((e) => ({ ...e, dados: { ...e.dados, ...p } }));

  const salvar = (e) => {
    e.preventDefault();
    const d = { ...ed.dados, id: ed.dados.id.trim(), nome: ed.dados.nome.trim(), nivel: +ed.dados.nivel };
    if (!d.id || !d.senha || !d.nome) return setErro("ID, senha e nome são obrigatórios.");
    if (ed.novo && db.agentes.some((a) => a.id.toLowerCase() === d.id.toLowerCase())) return setErro("Já existe um agente com esse ID.");
    atualizar((x) => ({
      agentes: ed.novo
        ? [...x.agentes, { tipoSanguineo: "O+", localNascimento: "", dataNascimento: "", ...d }]
        : x.agentes.map((a) => (a.id === d.id ? { ...a, ...d } : a)),
    }));
    setEd(null); setErro("");
  };

  const excluir = (a) => {
    if (!window.confirm(`Excluir ${a.nome} (${a.id}) e todos os dados dele?`)) return;
    atualizar((d) => ({
      agentes: d.agentes.filter((x) => x.id !== a.id),
      mensagens: d.mensagens.filter((m) => m.de !== a.id && m.para !== a.id),
      amizades: d.amizades.filter((m) => m.de !== a.id && m.para !== a.id),
      documentos: d.documentos.filter((x) => x.dono !== a.id),
      missoes: d.missoes.map((m) => ({ ...m, agentes: m.agentes.filter((i) => i !== a.id) })),
      equipes: d.equipes.map((e) => (e.mentor === a.id ? { ...e, mentor: null } : e)),
      notas: Object.fromEntries(Object.entries(d.notas).filter(([k]) => k !== a.id)),
      fichas: Object.fromEntries(Object.entries(d.fichas || {}).filter(([k]) => k !== a.id)),
    }));
    if (fichaDe === a.id) setFichaDe(null);
  };

  return (
    <>
      <div className="tarefas-topo">
        <p className="contagem">{db.agentes.length} agentes cadastrados</p>
        <button type="button" className="btn btn-acento" onClick={() => { setEd({ novo: true, dados: AGENTE_VAZIO }); setErro(""); }}>
          <Icon nome="mais" tamanho={16} /> novo agente
        </button>
      </div>

      {ed && (
        <form className="form-tarefa" onSubmit={salvar}>
          <Campo rotulo="ID (login)"><input value={ed.dados.id} disabled={!ed.novo} onChange={(e) => mud({ id: e.target.value })} /></Campo>
          <Campo rotulo="Senha"><input value={ed.dados.senha} onChange={(e) => mud({ senha: e.target.value })} /></Campo>
          <Campo rotulo="Nome"><input value={ed.dados.nome} onChange={(e) => mud({ nome: e.target.value })} /></Campo>
          <Campo rotulo="Cargo"><input value={ed.dados.cargo} onChange={(e) => mud({ cargo: e.target.value })} /></Campo>
          <Campo rotulo="Nível de acesso">
            <select value={ed.dados.nivel} onChange={(e) => mud({ nivel: e.target.value })}>
              {NIVEIS.map((n, i) => <option key={n} value={i}>{i} · {n}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Equipe">
            <select value={ed.dados.equipe || ""} onChange={(e) => mud({ equipe: e.target.value })}>
              <option value="">(sem equipe)</option>
              {db.equipes.map((q) => <option key={q.nome}>{q.nome}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Tipo">
            <select value={ed.dados.tipo || "jogador"} disabled={ehMestre(ed.dados)} onChange={(e) => mud({ tipo: e.target.value })}>
              <option value="jogador">Jogador</option>
              <option value="npc">NPC (sem ficha editável)</option>
            </select>
          </Campo>
          <Campo rotulo="Foto"><CampoImagem valor={ed.dados.foto} onChange={(foto) => mud({ foto })} /></Campo>
          {ehNpc(ed.dados) && (
            <>
              <Campo rotulo="Tipo sanguíneo (cartão)"><select value={ed.dados.tipoSanguineo} onChange={(e) => mud({ tipoSanguineo: e.target.value })}>{TIPOS_SANGUE.map((t) => <option key={t}>{t}</option>)}</select></Campo>
              <Campo rotulo="Data de nascimento (cartão)"><input type="date" value={ed.dados.dataNascimento} onChange={(e) => mud({ dataNascimento: e.target.value })} /></Campo>
              <Campo rotulo="Local de nascimento (cartão)"><input value={ed.dados.localNascimento} onChange={(e) => mud({ localNascimento: e.target.value })} /></Campo>
              <Campo rotulo="Classe (cartão)"><input value={ed.dados.classe} onChange={(e) => mud({ classe: e.target.value })} /></Campo>
              <Campo rotulo="Altura em cm (cartão)"><input type="number" min="0" value={ed.dados.altura} onChange={(e) => mud({ altura: e.target.value })} /></Campo>
            </>
          )}
          {erro && <p className="erro-login campo-largo" role="alert">{erro}</p>}
          <div className="campo-largo form-acoes">
            <button type="submit" className="btn btn-acento">salvar</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
          </div>
        </form>
      )}

      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Agente</th><th>Tipo</th><th>Nível</th><th>Equipe</th><th>Ações</th></tr></thead>
          <tbody>
            {db.agentes.map((a) => (
              <tr key={a.id}>
                <td>{a.nome} <span className="codigo">{a.id}</span></td>
                <td>{ehMestre(a) ? "Mestre" : ehNpc(a) ? "NPC" : "Jogador"}</td>
                <td>{a.nivel}</td>
                <td>{a.equipe || "—"}</td>
                <td className="acoes-linha">
                  <button type="button" className="btn btn-fantasma btn-mini" onClick={() => { setEd({ novo: false, dados: { ...AGENTE_VAZIO, ...a } }); setErro(""); }}>editar</button>
                  {!ehNpc(a) && <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setFichaDe(fichaDe === a.id ? null : a.id)}>ficha</button>}
                  {a.id !== eu.id && <button type="button" className="btn btn-fantasma btn-mini" onClick={() => navigate("/mensagens", { state: { com: a.id } })}>mensagem</button>}
                  {!ehMestre(a) && <button type="button" className="icone-btn" aria-label={`Excluir ${a.nome}`} onClick={() => excluir(a)}><Icon nome="lixeira" tamanho={16} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {fichaDe && db.agentes.find((a) => a.id === fichaDe) && (
        <>
          <h2 className="subtitulo">Ficha de {db.agentes.find((a) => a.id === fichaDe).nome}</h2>
          <FichaAgente key={fichaDe} agente={db.agentes.find((a) => a.id === fichaDe)} />
        </>
      )}
    </>
  );
};

// ---------------- Equipes ----------------
const CartaEquipe = ({ equipe }) => {
  const { db, atualizar } = useDados();
  const [nome, setNome] = useState(equipe.nome);
  const candidatos = db.agentes.filter((a) => !ehMestre(a));

  const renomear = () => {
    const n = nome.trim();
    if (!n || n === equipe.nome || db.equipes.some((e) => e.nome === n)) return setNome(equipe.nome);
    atualizar((d) => ({
      equipes: d.equipes.map((e) => (e.nome === equipe.nome ? { ...e, nome: n } : e)),
      agentes: d.agentes.map((a) => (a.equipe === equipe.nome ? { ...a, equipe: n } : a)),
    }));
  };
  const alternar = (id, entra) =>
    atualizar((d) => ({ agentes: d.agentes.map((a) => (a.id === id ? { ...a, equipe: entra ? equipe.nome : "" } : a)) }));
  const excluir = () => {
    if (!window.confirm(`Excluir a equipe ${equipe.nome}? Os agentes ficam sem equipe.`)) return;
    atualizar((d) => ({
      equipes: d.equipes.filter((e) => e.nome !== equipe.nome),
      agentes: d.agentes.map((a) => (a.equipe === equipe.nome ? { ...a, equipe: "" } : a)),
    }));
  };

  return (
    <article className="membro membro-equipe">
      <div className="form-doc">
        <Campo rotulo="Nome da equipe"><input value={nome} onChange={(e) => setNome(e.target.value)} onBlur={renomear} /></Campo>
        <Campo rotulo="Mentor">
          <select value={equipe.mentor || ""} onChange={(e) => atualizar((d) => ({ equipes: d.equipes.map((x) => (x.nome === equipe.nome ? { ...x, mentor: e.target.value || null } : x)) }))}>
            <option value="">(sem mentor)</option>
            {candidatos.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        </Campo>
      </div>
      <p className="membro-cargo">Membros</p>
      <ul className="lista-checks">
        {candidatos.map((a) => (
          <li key={a.id}>
            <label><input type="checkbox" checked={a.equipe === equipe.nome} onChange={(e) => alternar(a.id, e.target.checked)} /> {a.nome} <span className="codigo">{a.equipe && a.equipe !== equipe.nome ? `(em ${a.equipe})` : ""}</span></label>
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-fantasma btn-mini" onClick={excluir}>excluir equipe</button>
    </article>
  );
};

const EquipesMestre = () => {
  const { db, atualizar } = useDados();
  const [novo, setNovo] = useState("");
  const criar = (e) => {
    e.preventDefault();
    const n = novo.trim();
    if (!n || db.equipes.some((x) => x.nome === n)) return;
    atualizar((d) => ({ equipes: [...d.equipes, { nome: n, mentor: null }] }));
    setNovo("");
  };
  return (
    <>
      <form className="tarefas-topo" onSubmit={criar}>
        <p className="contagem">{db.equipes.length} equipes</p>
        <span className="campo-inline campo">
          <input value={novo} onChange={(e) => setNovo(e.target.value)} placeholder="Nome da nova equipe" />
          <button type="submit" className="btn btn-acento" disabled={!novo.trim()}><Icon nome="mais" tamanho={16} /> criar</button>
        </span>
      </form>
      <div className="grade-corp">{db.equipes.map((e) => <CartaEquipe key={e.nome} equipe={e} />)}</div>
    </>
  );
};

// ---------------- Missões ----------------
const MISSAO_VAZIA = { id: "", codigo: "", nome: "", status: "nao-iniciada", dataInicio: hojeISO(), local: "", agentes: [], descricao: "", imagensTxt: "" };
const imagensParaTexto = (l = []) => l.map((i) => `${i.url} | ${i.legenda}`).join("\n");
const textoParaImagens = (t) =>
  t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
    const [url, ...resto] = l.split("|");
    return { url: url.trim(), legenda: resto.join("|").trim() };
  });

const MissoesMestre = () => {
  const { db, atualizar } = useDados();
  const [ed, setEd] = useState(null);
  const mud = (p) => setEd((e) => ({ ...e, ...p }));
  const alternarAg = (id) => mud({ agentes: ed.agentes.includes(id) ? ed.agentes.filter((x) => x !== id) : [...ed.agentes, id] });

  const salvar = (e) => {
    e.preventDefault();
    if (!ed.nome.trim() || !ed.codigo.trim()) return;
    const { imagensTxt, ...resto } = ed;
    const m = { ...resto, id: ed.id || ed.codigo.trim().toLowerCase().replace(/\s+/g, "-") + "-" + uid().slice(-3), imagens: textoParaImagens(imagensTxt) };
    atualizar((d) => ({ missoes: ed.id ? d.missoes.map((x) => (x.id === ed.id ? m : x)) : [...d.missoes, m] }));
    setEd(null);
  };

  return (
    <>
      <div className="tarefas-topo">
        <p className="contagem">{db.missoes.length} missões</p>
        <button type="button" className="btn btn-acento" onClick={() => setEd(MISSAO_VAZIA)}><Icon nome="mais" tamanho={16} /> nova missão</button>
      </div>

      {ed && (
        <form className="form-tarefa" onSubmit={salvar}>
          <Campo rotulo="Código"><input value={ed.codigo} onChange={(e) => mud({ codigo: e.target.value })} placeholder="OP-006" /></Campo>
          <Campo rotulo="Nome"><input value={ed.nome} onChange={(e) => mud({ nome: e.target.value })} /></Campo>
          <Campo rotulo="Status">
            <select value={ed.status} onChange={(e) => mud({ status: e.target.value })}>
              {STATUS_MISSAO.map((s) => <option key={s.valor} value={s.valor}>{s.rotulo}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Data de início"><input type="date" value={ed.dataInicio} onChange={(e) => mud({ dataInicio: e.target.value })} /></Campo>
          <Campo rotulo="Local" largo><input value={ed.local} onChange={(e) => mud({ local: e.target.value })} /></Campo>
          <Campo rotulo="Descrição" largo><textarea rows={4} value={ed.descricao} onChange={(e) => mud({ descricao: e.target.value })} /></Campo>
          <Campo rotulo="Imagens (uma por linha: URL | legenda)" largo><textarea rows={3} value={ed.imagensTxt} onChange={(e) => mud({ imagensTxt: e.target.value })} /></Campo>
          <div className="campo-largo">
            <span className="rotulo">Agentes da missão</span>
            <ul className="lista-checks">
              {db.agentes.filter((a) => !ehMestre(a)).map((a) => (
                <li key={a.id}><label><input type="checkbox" checked={ed.agentes.includes(a.id)} onChange={() => alternarAg(a.id)} /> {a.nome}</label></li>
              ))}
            </ul>
          </div>
          <div className="campo-largo form-acoes">
            <button type="submit" className="btn btn-acento">salvar missão</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
          </div>
        </form>
      )}

      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Missão</th><th>Início</th><th>Agentes</th><th>Ações</th></tr></thead>
          <tbody>
            {db.missoes.map((m) => (
              <tr key={m.id}>
                <td>{m.nome} <span className="codigo">{m.codigo}</span></td>
                <td>{formatarData(m.dataInicio)}</td>
                <td>{m.agentes.length}</td>
                <td className="acoes-linha">
                  <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setEd({ ...MISSAO_VAZIA, ...m, imagensTxt: imagensParaTexto(m.imagens) })}>editar</button>
                  <button type="button" className="icone-btn" aria-label={`Excluir ${m.nome}`} onClick={() => window.confirm(`Excluir ${m.codigo}?`) && atualizar((d) => ({ missoes: d.missoes.filter((x) => x.id !== m.id) }))}><Icon nome="lixeira" tamanho={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ---------------- Documentos ----------------
const DOC_VAZIO = { titulo: "", tipo: "texto", conteudo: "" };

const DocumentosMestre = () => {
  const { db, atualizar } = useDados();
  const [doc, setDoc] = useState(DOC_VAZIO);
  const [para, setPara] = useState([]);
  const [ok, setOk] = useState("");
  const alvos = db.agentes.filter((a) => !ehMestre(a));
  const nome = (id) => db.agentes.find((a) => a.id === id)?.nome || id;

  const enviar = (e) => {
    e.preventDefault();
    if (!doc.titulo.trim() || !doc.conteudo.trim() || para.length === 0) return setOk("Preencha título, conteúdo e escolha ao menos um agente.");
    const agora = new Date().toISOString();
    atualizar((d) => ({ documentos: [...d.documentos, ...para.map((id) => ({ id: uid(), dono: id, ...doc, titulo: doc.titulo.trim(), de: "MESTRE", data: agora }))] }));
    setDoc(DOC_VAZIO); setPara([]); setOk(`Documento enviado a ${para.length} agente(s).`);
  };

  return (
    <>
      <form className="form-tarefa" onSubmit={enviar}>
        <div className="campo-largo"><FormDocumento valor={doc} aoMudar={setDoc} /></div>
        <div className="campo-largo">
          <span className="rotulo">Enviar para</span>
          <ul className="lista-checks">
            <li><button type="button" className="btn btn-fantasma btn-mini" onClick={() => setPara(para.length === alvos.length ? [] : alvos.map((a) => a.id))}>todos</button></li>
            {alvos.map((a) => (
              <li key={a.id}><label><input type="checkbox" checked={para.includes(a.id)} onChange={() => setPara(para.includes(a.id) ? para.filter((x) => x !== a.id) : [...para, a.id])} /> {a.nome}</label></li>
            ))}
          </ul>
        </div>
        {ok && <p className="aviso campo-largo" role="status">{ok}</p>}
        <div className="campo-largo form-acoes"><button type="submit" className="btn btn-acento">enviar documento</button></div>
      </form>

      <h2 className="subtitulo">Documentos nos arquivos dos agentes</h2>
      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Título</th><th>Agente</th><th>Tipo</th><th /></tr></thead>
          <tbody>
            {db.documentos.length === 0 && <tr><td colSpan={4} className="vazio">Nenhum documento.</td></tr>}
            {db.documentos.map((d) => (
              <tr key={d.id}>
                <td>{d.titulo}</td><td>{nome(d.dono)}</td><td>{d.tipo}</td>
                <td><button type="button" className="icone-btn" aria-label="Excluir documento" onClick={() => atualizar((x) => ({ documentos: x.documentos.filter((y) => y.id !== d.id) }))}><Icon nome="lixeira" tamanho={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ---------------- Entidades ----------------
const ENT_VAZIA = { id: "", nome: "", contencao: "pendente", nivel: 1, foto: "", descricao: "" };

const EntidadesMestre = () => {
  const { db, atualizar } = useDados();
  const [ed, setEd] = useState(null); // { novo, dados }
  const [erro, setErro] = useState("");
  const mud = (p) => setEd((e) => ({ ...e, dados: { ...e.dados, ...p } }));

  const salvar = (e) => {
    e.preventDefault();
    const d = { ...ed.dados, id: ed.dados.id.trim().replace(/^id-/i, ""), nome: ed.dados.nome.trim(), nivel: +ed.dados.nivel };
    if (!d.id || !d.nome) return setErro("ID e nome são obrigatórios.");
    if (ed.novo && db.entidades.some((x) => x.id === d.id)) return setErro("Já existe uma entidade com esse ID.");
    atualizar((x) => ({ entidades: ed.novo ? [...x.entidades, d] : x.entidades.map((y) => (y.id === d.id ? d : y)) }));
    setEd(null); setErro("");
  };

  return (
    <>
      <div className="tarefas-topo">
        <p className="contagem">{db.entidades.length} entidades</p>
        <button type="button" className="btn btn-acento" onClick={() => { setEd({ novo: true, dados: ENT_VAZIA }); setErro(""); }}><Icon nome="mais" tamanho={16} /> nova entidade</button>
      </div>

      {ed && (
        <form className="form-tarefa" onSubmit={salvar}>
          <Campo rotulo="ID (só números/letras, sem 'ID-')"><input value={ed.dados.id} disabled={!ed.novo} onChange={(e) => mud({ id: e.target.value })} /></Campo>
          <Campo rotulo="Nome"><input value={ed.dados.nome} onChange={(e) => mud({ nome: e.target.value })} /></Campo>
          <Campo rotulo="Contenção">
            <select value={ed.dados.contencao} onChange={(e) => mud({ contencao: e.target.value })}>
              {CONTENCAO.map((c) => <option key={c.valor} value={c.valor}>{c.rotulo}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Nível de acesso exigido">
            <select value={ed.dados.nivel} onChange={(e) => mud({ nivel: e.target.value })}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </Campo>
          <Campo rotulo="Foto" largo><CampoImagem valor={ed.dados.foto} onChange={(foto) => mud({ foto })} /></Campo>
          <Campo rotulo="Descrição (parágrafos separados por linha em branco; [[texto]] vira tarja)" largo><textarea rows={6} value={ed.dados.descricao} onChange={(e) => mud({ descricao: e.target.value })} /></Campo>
          {erro && <p className="erro-login campo-largo" role="alert">{erro}</p>}
          <div className="campo-largo form-acoes">
            <button type="submit" className="btn btn-acento">salvar</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
          </div>
        </form>
      )}

      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Entidade</th><th>Contenção</th><th>Nível</th><th>Ações</th></tr></thead>
          <tbody>
            {db.entidades.map((x) => (
              <tr key={x.id}>
                <td>{x.nome} <span className="codigo">ID-{x.id}</span></td>
                <td>{CONTENCAO.find((c) => c.valor === x.contencao)?.rotulo}</td>
                <td>{x.nivel}</td>
                <td className="acoes-linha">
                  <button type="button" className="btn btn-fantasma btn-mini" onClick={() => { setEd({ novo: false, dados: { ...ENT_VAZIA, ...x } }); setErro(""); }}>editar</button>
                  <button type="button" className="icone-btn" aria-label={`Excluir ${x.nome}`} onClick={() => window.confirm(`Excluir ${x.nome}?`) && atualizar((d) => ({ entidades: d.entidades.filter((y) => y.id !== x.id) }))}><Icon nome="lixeira" tamanho={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ---------------- Banco de Dados ----------------
const BANCO_VAZIO = { id: "", codigo: "", designacao: "", local: "", ameaca: "Baixa", status: "Contida", data: hojeISO(), nivel: 1, descricao: "", contencao: "", incidentesTxt: "" };

const BancoMestre = () => {
  const { db, atualizar } = useDados();
  const [ed, setEd] = useState(null);
  const mud = (p) => setEd((e) => ({ ...e, ...p }));

  const salvar = (e) => {
    e.preventDefault();
    if (!ed.codigo.trim() || !ed.designacao.trim()) return;
    const { incidentesTxt, ...resto } = ed;
    const x = { ...resto, nivel: +ed.nivel, id: ed.id || ed.codigo.trim().toLowerCase().replace(/\s+/g, "-") + "-" + uid().slice(-3), incidentes: incidentesTxt.split("\n").map((l) => l.trim()).filter(Boolean) };
    atualizar((d) => ({ banco: ed.id ? d.banco.map((y) => (y.id === ed.id ? x : y)) : [...d.banco, x] }));
    setEd(null);
  };

  return (
    <>
      <div className="tarefas-topo">
        <p className="contagem">{db.banco.length} arquivos</p>
        <button type="button" className="btn btn-acento" onClick={() => setEd(BANCO_VAZIO)}><Icon nome="mais" tamanho={16} /> novo arquivo</button>
      </div>

      {ed && (
        <form className="form-tarefa" onSubmit={salvar}>
          <Campo rotulo="Código"><input value={ed.codigo} onChange={(e) => mud({ codigo: e.target.value })} placeholder="MSNR-060" /></Campo>
          <Campo rotulo="Designação"><input value={ed.designacao} onChange={(e) => mud({ designacao: e.target.value })} /></Campo>
          <Campo rotulo="Local"><input value={ed.local} onChange={(e) => mud({ local: e.target.value })} /></Campo>
          <Campo rotulo="Data"><input type="date" value={ed.data} onChange={(e) => mud({ data: e.target.value })} /></Campo>
          <Campo rotulo="Ameaça"><select value={ed.ameaca} onChange={(e) => mud({ ameaca: e.target.value })}>{AMEACAS.map((a) => <option key={a}>{a}</option>)}</select></Campo>
          <Campo rotulo="Status"><select value={ed.status} onChange={(e) => mud({ status: e.target.value })}>{STATUS_BANCO.map((a) => <option key={a}>{a}</option>)}</select></Campo>
          <Campo rotulo="Nível de acesso (1 a 5)"><select value={ed.nivel} onChange={(e) => mud({ nivel: e.target.value })}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select></Campo>
          <Campo rotulo="Descrição ([[texto]] vira tarja)" largo><textarea rows={4} value={ed.descricao} onChange={(e) => mud({ descricao: e.target.value })} /></Campo>
          <Campo rotulo="Procedimentos de contenção" largo><textarea rows={3} value={ed.contencao} onChange={(e) => mud({ contencao: e.target.value })} /></Campo>
          <Campo rotulo="Incidentes (um por linha)" largo><textarea rows={3} value={ed.incidentesTxt} onChange={(e) => mud({ incidentesTxt: e.target.value })} /></Campo>
          <div className="campo-largo form-acoes">
            <button type="submit" className="btn btn-acento">salvar arquivo</button>
            <button type="button" className="btn btn-fantasma" onClick={() => setEd(null)}>cancelar</button>
          </div>
        </form>
      )}

      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Arquivo</th><th>Nível</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {db.banco.map((x) => (
              <tr key={x.id}>
                <td>{x.designacao} <span className="codigo">{x.codigo}</span></td>
                <td>{x.nivel}</td>
                <td>{x.status}</td>
                <td className="acoes-linha">
                  <button type="button" className="btn btn-fantasma btn-mini" onClick={() => setEd({ ...BANCO_VAZIO, ...x, incidentesTxt: x.incidentes.join("\n") })}>editar</button>
                  <button type="button" className="icone-btn" aria-label={`Excluir ${x.codigo}`} onClick={() => window.confirm(`Excluir ${x.codigo}?`) && atualizar((d) => ({ banco: d.banco.filter((y) => y.id !== x.id) }))}><Icon nome="lixeira" tamanho={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ---------------- Mensagens (editar data/hora) ----------------
const MensagensMestre = () => {
  const { db, atualizar } = useDados();
  const nome = (id) => db.agentes.find((a) => a.id === id)?.nome || id;
  const lista = [...db.mensagens].sort((a, b) => b.data.localeCompare(a.data));
  // Muda a data/hora de uma mensagem (ignora campo vazio/inválido)
  const mudarData = (id, v) => v && atualizar((d) => ({ mensagens: d.mensagens.map((m) => (m.id === id ? { ...m, data: deInputLocal(v) } : m)) }));

  return (
    <>
      <p className="contagem">{lista.length} mensagens (mais recentes primeiro)</p>
      <div className="tabela-wrap">
        <table className="tabela">
          <thead><tr><th>Data e hora</th><th>De → Para</th><th>Mensagem</th><th /></tr></thead>
          <tbody>
            {lista.length === 0 && <tr><td colSpan={4} className="vazio">Nenhuma mensagem enviada ainda.</td></tr>}
            {lista.map((m) => (
              <tr key={m.id}>
                <td><input type="datetime-local" value={paraInputLocal(m.data)} onChange={(e) => mudarData(m.id, e.target.value)} aria-label={`Data da mensagem (${formatarHora(m.data)})`} /></td>
                <td>{nome(m.de)} → {nome(m.para)}</td>
                <td>{m.texto ? m.texto.slice(0, 70) : `(documento: ${m.anexo?.titulo})`}</td>
                <td><button type="button" className="icone-btn" aria-label="Excluir mensagem" onClick={() => atualizar((d) => ({ mensagens: d.mensagens.filter((x) => x.id !== m.id) }))}><Icon nome="lixeira" tamanho={16} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

// ---------------- Site (vídeo e unidades da aba Sobre) ----------------
const SiteMestre = () => {
  const { db, atualizar } = useDados();
  const c = db.config;
  const set = (p) => atualizar((d) => ({ config: { ...d.config, ...p } }));
  const mudaU = (i, p) => set({ unidades: c.unidades.map((u, j) => (j === i ? { ...u, ...p } : u)) });

  return (
    <>
      <TextosMestre />
      <h2 className="subtitulo">Vídeo</h2>
      <div className="form-tarefa">
        <Campo rotulo="Link do vídeo de boas-vindas (YouTube, Vimeo ou arquivo de vídeo)" largo>
          <input value={c.videoUrl} onChange={(e) => set({ videoUrl: e.target.value })} placeholder="https://..." />
        </Campo>
      </div>
      <h2 className="subtitulo">Unidades da Fundação</h2>
      {c.unidades.map((u, i) => (
        <div key={i} className="form-tarefa">
          <Campo rotulo="Nome"><input value={u.nome} onChange={(e) => mudaU(i, { nome: e.target.value })} /></Campo>
          <Campo rotulo="Imagem"><CampoImagem valor={u.imagem} onChange={(imagem) => mudaU(i, { imagem })} /></Campo>
          <Campo rotulo="Descrição curta" largo><input value={u.descricao} onChange={(e) => mudaU(i, { descricao: e.target.value })} /></Campo>
          <div className="campo-largo"><button type="button" className="btn btn-fantasma btn-mini" onClick={() => set({ unidades: c.unidades.filter((_, j) => j !== i) })}>remover unidade</button></div>
        </div>
      ))}
      <button type="button" className="btn btn-acento" onClick={() => set({ unidades: [...c.unidades, { nome: "", imagem: "", descricao: "" }] })}><Icon nome="mais" tamanho={16} /> nova unidade</button>
    </>
  );
};

// Rota: /mestre (só o cargo MESTRE entra — ver RotaProtegida somenteMestre)
const Mestre = () => {
  const [aba, setAba] = useState("agentes");
  const { reiniciar, importarDoNavegador, erroSalvar, remoto } = useDados();
  const corpo = { agentes: <AgentesMestre />, equipes: <EquipesMestre />, missoes: <MissoesMestre />, documentos: <DocumentosMestre />, entidades: <EntidadesMestre />, banco: <BancoMestre />, contratos: <ContratosMestre />, corporacao: <CorporacaoMestre />, mensagens: <MensagensMestre />, site: <SiteMestre /> }[aba];
  return (
    <>
      <Banner compacto />
      <section className="pagina">
        <h1 className="titulo-pagina">Painel do Mestre</h1>
        <div className="abas" role="tablist">
          {SUBABAS.map(([id, rotulo]) => (
            <button key={id} type="button" role="tab" aria-selected={aba === id} className={`aba ${aba === id ? "ativa" : ""}`} onClick={() => setAba(id)}>{rotulo}</button>
          ))}
        </div>
        <div className="painel-aba">{corpo}</div>
        {erroSalvar && <p className="aviso" role="alert">Não foi possível salvar no Supabase ({erroSalvar}). Tentando de novo…</p>}
        <p className="rodape-mestre">
          <span className="codigo">{remoto ? "dados salvos no Supabase" : "modo local (sem Supabase)"} </span>
          <button type="button" className="btn btn-fantasma btn-mini" onClick={() => window.confirm("Copiar os dados antigos deste navegador para o banco atual? Isso substitui os dados correspondentes.") && window.alert(importarDoNavegador() ? "Dados enviados." : "Não há dados antigos neste navegador.")}>enviar dados antigos deste navegador</button>{" "}
          <button type="button" className="btn btn-fantasma btn-mini" onClick={() => window.confirm("Apagar TODOS os dados e voltar ao início?") && reiniciar()}>restaurar dados de exemplo</button>
        </p>
      </section>
    </>
  );
};

export default Mestre;
