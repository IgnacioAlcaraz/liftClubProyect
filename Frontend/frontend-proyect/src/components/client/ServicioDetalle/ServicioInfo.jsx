import React from "react";
import StarRating from "../../starRating/StarRating";
const ServicioInfo = ({ servicio }) => {
  const coach = servicio.coachId || {};

  return (
    <div className="p-3">
      <h3 className="fw-bold">{servicio.name}</h3>
      <p className="text-muted">{`${coach.firstName || ""} ${
        coach.lastName || ""
      }`}</p>

      <div className="mb-3">
        <StarRating
          rating={servicio.averageRating || 0}
          reviewsCount={servicio.reviews?.length || 0}
        />
      </div>
    </div>
  );
};

export default ServicioInfo;
