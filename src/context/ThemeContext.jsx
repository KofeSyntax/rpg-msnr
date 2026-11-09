import { createContext, useContext, useState, useEffect } from "react";

const CHAVE_TEMA = "msnr:tema";

const ThemeContext = createContext(null);

// Tema padrão: claro (preto e branco com detalhes vinho)
const lerTema = () => {
  try {
    return window.localStorage.getItem(CHAVE_TEMA) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const ThemeProvider = ({ children }) => {
  const [tema, setTema] = useState(lerTema);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    try {
      window.localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
      /* ignora */
    }
  }, [tema]);

  const alternarTema = () => setTema((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ tema, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
