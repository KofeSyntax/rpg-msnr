import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Banner from "../components/Banner";
import AlertaBox from "../components/AlertaBox";
import SecaoVideo from "../components/SecaoVideo";
import SecaoSobre from "../components/SecaoSobre";
import SecaoUnidades from "../components/SecaoUnidades";
import SecaoContratos from "../components/SecaoContratos";
import { useAuth } from "../context/AuthContext";

// Visitante vê só o aviso e os contratos; agente logado vê também vídeo, sobre e unidades.
const Home = () => {
  const location = useLocation();
  const { logado } = useAuth();

  // A Navbar envia { secao: "sobre" | "contratos" } para rolar até a seção
  useEffect(() => {
    const secao = location.state?.secao;
    const alvo = secao && document.getElementById(secao);
    if (alvo) alvo.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location]);

  return (
    <>
      <Banner />
      <AlertaBox />
      {logado && (
        <>
          <SecaoVideo />
          <SecaoSobre />
          <SecaoUnidades />
        </>
      )}
      <SecaoContratos />
    </>
  );
};

export default Home;
