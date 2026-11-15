import { useState } from "react";
import Relacoes from "../Relacoes";
import { useDados } from "../../context/DataContext";
import { ehMestre } from "../../utils/regras";

// Mestre: escolhe um agente/NPC da Fundação e define as relações dele (jogadores não editam).
const RelacoesMestre = () => {
  const { db } = useDados();
  const [id, setId] = useState("");
  const donos = db.agentes.filter((a) => !ehMestre(a));
  const dono = donos.find((a) => a.id === id);
  return (
    <>
      <label className="campo campo-inline">
        <span>Relações de</span>
        <select value={id} onChange={(e) => setId(e.target.value)}>
          <option value="">Escolher agente…</option>
          {donos.map((a) => <option key={a.id} value={a.id}>{a.nome} ({a.id})</option>)}
        </select>
      </label>
      {donos.length === 0 && <p className="vazio">Cadastre agentes na aba "Agentes" primeiro.</p>}
      {dono && <Relacoes key={dono.id} agente={dono} editavel />}
    </>
  );
};

export default RelacoesMestre;
