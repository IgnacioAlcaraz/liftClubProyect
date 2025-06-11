import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import RegisterPage from "./pages/Register";
import GoogleSuccess from "./pages/GoogleSuccess";
import ClientHome from "./pages/ClientHome";
import CoachHome from "./pages/CoachHome";
import ClientPageServicio1 from "./pages/ClientPageServicio1";
import ClientPagePago from "./pages/ClientPagePago";
import ClientPageMisServicios from "./pages/ClientPageMisServicios";
import StatsPage from "./pages/StatsPage";
import PasswordReset from "./pages/PasswordReset";
import CoachServices from "./pages/CoachServices";
import Success from "./components/client/MercadoPago/Success";
import Failure from "./components/client/MercadoPago/Failure";
import Pending from "./components/client/MercadoPago/Pending";
import "./App.css";

import { initMercadoPago } from "@mercadopago/sdk-react";

// Inicializar MercadoPago con clave pública desde .env
const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(PUBLIC_KEY, {
  locale: "es-AR",
  advancedFraudPrevention: false, // ideal para entorno sandbox
});

const App = () => {
  //  Mostrar en consola que se cargó correctamente la public key

  console.log("Clave pública usada:", PUBLIC_KEY);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/client-home" element={<ClientHome />} />
        <Route
          path="/client-page-servicio1/:id"
          element={<ClientPageServicio1 />}
        />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/client-page-pago/:id" element={<ClientPagePago />} />
        <Route path="/mis-servicios" element={<ClientPageMisServicios />} />
        <Route path="/coach-home" element={<CoachHome />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/forgot-password" element={<PasswordReset />} />
        <Route path="/coach-services" element={<CoachServices />} />

        {/* Rutas de resultado de pago */}
        <Route path="/payment/success" element={<Success />} />
        <Route path="/payment/failure" element={<Failure />} />
        <Route path="/payment/pending" element={<Pending />} />
      </Routes>
    </Router>
  );
};

export default App;
