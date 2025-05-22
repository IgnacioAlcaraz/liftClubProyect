import React from "react";
import ServicioImagenCarousel from "./ServicioImagenCarousel";
import ServicioInfo from "./ServicioInfo";
import ComentariosList from "./ComentariosList";

const ServicioDetalleCard = ({ servicio }) => {
  return (
    <div className="card shadow p-3 mb-4 bg-white rounded">
      <ServicioImagenCarousel imagenes={servicio.images} />
      <ServicioInfo servicio={servicio} />
      <ComentariosList comentarios={servicio.reviews} />
    </div>
  );
};

export default ServicioDetalleCard;
