import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Estrutura comum a todas as páginas: Navbar + conteúdo + Footer
const Layout = () => {
  const { pathname, state } = useLocation();

  // Ao trocar de página, volta ao topo (exceto quando vai rolar até uma seção)
  useEffect(() => {
    if (!state?.secao) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
