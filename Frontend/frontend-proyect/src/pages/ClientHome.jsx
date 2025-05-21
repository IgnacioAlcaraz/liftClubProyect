import React from "react";
import ListaDeServicios from "../components/client/serviceList/serviceList";
import PrimaryButton from "../components/primaryButton/PrimaryButton";
import { Paperclip } from "lucide-react";

const ClientHome = () => {
  return (
    <>
      <div className="container py-4">
        <PrimaryButton
          icon={Paperclip}
          text="Mis Servicios"
          to="/mis-servicios"
          variant="primary"
        />
        <h2 className="fw-bold mb-2">Encontra los mejores entrenadores...</h2>
        <p className="text-secondary mb-4">
          Descubre profesionales que te ayudarán a alcanzar objetivos
        </p>
        <ListaDeServicios />
      </div>
    </>
  );
};

export default ClientHome;
