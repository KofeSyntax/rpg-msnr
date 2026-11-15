import { createContext, useContext, useState, useCallback } from "react";
import { useDados } from "./DataContext";

const CHAVE_SESSAO = "msnr:agente-logado";
const AuthContext = createContext(null);

const lerSessao = () => {
  try { return window.sessionStorage.getItem(CHAVE_SESSAO) || null; } catch { return null; }
};

export const AuthProvider = ({ children }) => {
  const { db } = useDados();
  const [id, setId] = useState(lerSessao);
  // O agente vem do banco: edições do mestre aparecem na hora (e agente excluído = deslogado)
  const agente = id ? db.agentes.find((a) => a.id === id) || null : null;

  const login = useCallback(
    (idDigitado, senha) => {
      const encontrado = db.agentes.find(
        (a) => a.id.toLowerCase() === idDigitado.trim().toLowerCase() && a.senha === senha
      );
      if (!encontrado) return { ok: false, erro: "ID ou senha não reconhecidos." };
      try { window.sessionStorage.setItem(CHAVE_SESSAO, encontrado.id); } catch { /* ignora */ }
      setId(encontrado.id);
      return { ok: true };
    },
    [db.agentes]
  );

  const logout = useCallback(() => {
    try { window.sessionStorage.removeItem(CHAVE_SESSAO); } catch { /* ignora */ }
    setId(null);
  }, []);

  return (
    <AuthContext.Provider value={{ agente, logado: !!agente, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
