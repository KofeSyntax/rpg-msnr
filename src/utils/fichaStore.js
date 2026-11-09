import { useCallback } from "react";
import { fichaInicial } from "../data/ficha";
import { useDados } from "../context/DataContext";

// A ficha de cada agente fica em db.fichas (Supabase). O cartão do agente lê a mesma ficha.
export const fichaSalva = (db, agente) => ({ ...fichaInicial(agente), ...(db.fichas?.[agente?.id] || {}) });

// Mantém a ficha atualizada em tempo real (ex.: no cartão do agente)
export const useFicha = (agente) => {
  const { db } = useDados();
  return fichaSalva(db, agente);
};

// const salvar = useSalvarFicha(); salvar(agente, ficha)
export const useSalvarFicha = () => {
  const { atualizar } = useDados();
  return useCallback((agente, ficha) => {
    if (!agente?.id) return;
    atualizar((d) => {
      const atual = d.fichas?.[agente.id];
      if (atual && JSON.stringify(atual) === JSON.stringify(ficha)) return {};
      return { fichas: { ...d.fichas, [agente.id]: ficha } };
    });
  }, [atualizar]);
};
