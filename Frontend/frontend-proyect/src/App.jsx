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
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import "./App.css";

import { initMercadoPago } from "@mercadopago/sdk-react";

const PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(PUBLIC_KEY, {
  locale: "es-AR",
  advancedFraudPrevention: false,
});

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas de autenticación */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/client-home" element={<ClientHome />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/forgot-password" element={<PasswordReset />} />

        {/* Rutas de cliente */}
        <Route
          path="/client-page-pago/:id"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPagePago />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mis-servicios"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPageMisServicios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-page-servicio1/:id"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <ClientPageServicio1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Success />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/failure"
          element={
            <ProtectedRoute allowedRoles={["client"]}>
              <Failure />
            </ProtectedRoute>
          }
        />

        {/* Rutas de coach */}
        <Route
          path="/stats"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach-home"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CoachHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach-services"
          element={
            <ProtectedRoute allowedRoles={["coach"]}>
              <CoachServices />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
