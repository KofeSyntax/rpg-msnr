import { useRef, useState } from "react";
import Icon from "./Icon";
import FotoAgente from "./FotoAgente";
import CodigoBarras from "./CodigoBarras";
import CodigoQR from "./CodigoQR";
import { SITE } from "../data/site";
import { NIVEIS } from "../data/abas";
import { formatarData, calcularIdade } from "../utils/formatar";
import { useFicha } from "../utils/fichaStore";
import { ehNpc } from "../utils/regras";
import { exportarImagem } from "../utils/exportar";

// Cartão de identificação (jogador: dados da FICHA; NPC: dados da conta). Nome, tipo sanguíneo, nascimento, local, classe e altura
// vêm da FICHA do agente (mudou na ficha, muda no cartão). ID, cargo, nível e equipe vêm da conta.
const CartaoAgente = ({ agente, somenteLeitura = false }) => {
  const ficha = useFicha(agente);
  // NPC não tem ficha: o cartão usa os dados que o Mestre editou na conta
  const f = ehNpc(agente)
    ? { personagem: agente.nome, sangue: agente.tipoSanguineo || "—", nascimento: agente.dataNascimento || "", localNascimento: agente.localNascimento || "", classe: agente.classe || "", altura: agente.altura || "" }
    : ficha;
  const cartaoRef = useRef(null);
  const [msg, setMsg] = useState("");
  const exportar = async () => {
    try {
      await exportarImagem(cartaoRef.current, `cartao-${(f.personagem || agente.nome).trim().replace(/\s+/g, "_")}`);
      setMsg("Imagem do cartão gerada.");
    } catch (e) {
      setMsg(`Falha ao exportar: ${e.message}`);
    }
  };
  const idade = calcularIdade(f.nascimento);
  const dados = [
    ["ID", agente.id],
    ["Cargo", agente.cargo],
    f.classe && ["Classe", f.classe],
    ["Nível de acesso", `${agente.nivel} / 5 · ${NIVEIS[agente.nivel]}`],
    ["Tipo sanguíneo", f.sangue],
    ["Local de nascimento", f.localNascimento || "—"],
    ["Data de nascimento", f.nascimento ? `${formatarData(f.nascimento)}${idade != null ? ` (${idade} anos)` : ""}` : "—"],
    f.altura && ["Altura", `${f.altura} cm`],
    ["Equipe", agente.equipe || SITE.equipePadrao],
  ].filter(Boolean);

  return (
    <>
    <article className="cartao-agente" ref={cartaoRef}>
      <header className="cartao-topo">
        <Icon nome="escudo" tamanho={34} />
        <h2>{SITE.tituloCartao}</h2>
      </header>

      <div className="cartao-corpo">
        <div className="cartao-coluna">
          <h3 className="cartao-nome">{f.personagem || agente.nome}</h3>
          <dl className="cartao-dados">
            {dados.map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt>{rotulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>
          <CodigoQR valor={agente.id} />
        </div>

        <div className="cartao-lateral">
          <FotoAgente src={agente.foto} nome={f.personagem || agente.nome} />
          <CodigoBarras valor={agente.id} />
        </div>
      </div>
    </article>
    {!somenteLeitura && (
    <div className="cartao-export">
      <button type="button" className="btn btn-fantasma" onClick={exportar}>exportar cartão (imagem)</button>
      {msg && <p className="codigo" role="status">{msg}</p>}
    </div>
    )}
    </>
  );
};

export default CartaoAgente;
