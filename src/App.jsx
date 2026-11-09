import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";
import Home from "./pages/Home";
import Agentes from "./pages/Agentes";
import MissaoDetalhe from "./pages/MissaoDetalhe";
import BancoDetalhe from "./pages/BancoDetalhe";
import CorporacaoPagina from "./pages/CorporacaoPagina";
import Entidades from "./pages/Entidades";
import EntidadeDetalhe from "./pages/EntidadeDetalhe";
import Mensagens from "./pages/Mensagens";
import Mestre from "./pages/Mestre";
import NotFound from "./pages/NotFound";

// As rotas. O <BrowserRouter> e os providers ficam no main.jsx.
const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="agentes" element={<Agentes />} />
        <Route
          path="agentes/missoes/:id"
          element={
            <RotaProtegida>
              <MissaoDetalhe />
            </RotaProtegida>
          }
        />
        <Route
          path="agentes/banco/:id"
          element={
            <RotaProtegida nivelMinimo={1}>
              <BancoDetalhe />
            </RotaProtegida>
          }
        />
        <Route path="corporacao" element={<RotaProtegida><CorporacaoPagina /></RotaProtegida>} />
        <Route path="entidades" element={<RotaProtegida nivelMinimo={1}><Entidades /></RotaProtegida>} />
        <Route path="entidades/:id" element={<RotaProtegida nivelMinimo={1}><EntidadeDetalhe /></RotaProtegida>} />
        <Route path="mensagens" element={<RotaProtegida><Mensagens /></RotaProtegida>} />
        <Route path="mestre" element={<RotaProtegida somenteMestre><Mestre /></RotaProtegida>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
