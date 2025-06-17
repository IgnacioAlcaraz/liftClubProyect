import React from "react";

const ServicioImagenCarousel = ({ imagenes = [] }) => {
  if (!imagenes.length || !imagenes[0].url) return null;

  const imagenSrc = `http://localhost:5000${imagenes[0].url}`;

  return (
    <div style={{ width: "100%", maxHeight: "300px", overflow: "hidden" }}>
      <img
        src={imagenSrc}
        alt="Servicio"
        className="img-fluid w-100"
        style={{ objectFit: "cover", height: "300px" }}
      />
    </div>
  );
};

export default ServicioImagenCarousel;
