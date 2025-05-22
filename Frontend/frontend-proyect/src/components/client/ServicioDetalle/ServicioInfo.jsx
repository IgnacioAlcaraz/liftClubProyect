import React from "react";

const ServicioInfo = ({ servicio }) => {
  const coach = servicio.coachId || {};

  return (
    <div className="p-3">
      <h3 className="fw-bold">{servicio.name}</h3>
      <p className="text-muted">{`${coach.firstName || ""} ${
        coach.lastName || ""
      }`}</p>

      <div className="mb-3">
        {Array.from({ length: Math.round(servicio.averageRating || 5) }).map(
          (_, i) => (
            <span key={i}>⭐</span>
          )
        )}
      </div>
    </div>
  );
};

export default ServicioInfo;
