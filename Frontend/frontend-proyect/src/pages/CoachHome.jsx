import React from "react";
import PrimaryButton from "../components/primaryButton/PrimaryButton";
import { Plus } from "lucide-react";

// Usa un mensaje temporal hasta que implementes el componente para coach
const CoachHome = () => {
  return (
    <>
      <div className="container py-4">
        <div className="d-flex justify-content-end mb-4">
          <PrimaryButton
            icon={Plus}
            text="Crear Servicio"
            to="/crear-servicio"
            variant="primary"
          />
        </div>
        <h2 className="fw-bold mb-2">Mis servicios</h2>
        <p className="text-secondary mb-4">
          Administra tus entrenamientos y servicios
        </p>
        <p>Lista de servicios del coach (en construcción)</p>
      </div>
    </>
  );
};

export default CoachHome;