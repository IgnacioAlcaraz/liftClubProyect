import React from "react";
import ServicioImagenCarousel from "./ServicioImagenCarousel";
import ServicioInfo from "./ServicioInfo";
import ComentariosList from "./ComentariosList";
import "./ServicioDetalleCard.css";

const ServicioDetalleCard = ({ servicio, reviews }) => {
  const comentarios = (reviews || []).map((r) => ({
    author: `${r.clientId?.firstName || "Usuario"} ${
      r.clientId?.lastName || ""
    }`,
    text: r.comment,
    reply: r.trainerResponse,
  }));

  return (
    <div className="detalle-card card shadow p-3 mb-4 bg-white rounded">
      <ServicioImagenCarousel imagenes={servicio.images} />
      <ServicioInfo servicio={servicio} />
      <ComentariosList comentarios={comentarios} />
    </div>
  );
};

export default ServicioDetalleCard;
