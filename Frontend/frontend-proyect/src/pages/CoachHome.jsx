import React from "react";
import ServiceListCoach from "../components/coach/serviceListCoach/serviceListCoach";
import HeaderCoach from "../components/coach/headerCoach/headerCoach";

const CoachHome = () => {
  return (
    <>
      <HeaderCoach />
      <div className="container py-4">
        <h2 className="fw-bold mb-2">Servicios Cargados</h2>
        <p className="text-secondary mb-4">
          Administra tus entrenamientos y servicios
        </p>
        <ServiceListCoach />
      </div>
    </>
  );
};

export default CoachHome;
