// Botão que alterna entre tema claro e escuro.
import Icon from "./Icon";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { tema, alternarTema } = useTheme();
  const escuro = tema === "dark";
  const rotulo = escuro ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <button
      type="button"
      className="tema-toggle"
      onClick={alternarTema}
      aria-label={rotulo}
      title={rotulo}
    >
      <Icon nome={escuro ? "sol" : "lua"} />
    </button>
  );
};

export default ThemeToggle;
