import React from "react";

const ServicioImagenCarousel = ({ imagenes = [] }) => {
  const imagenSrc = imagenes[0] || "https://via.placeholder.com/600x300";

  return (
    <img
      src={imagenSrc}
      alt="Servicio"
      className="img-fluid rounded"
      style={{ objectFit: "cover", width: "100%", height: "300px" }}
    />
  );
};

export default ServicioImagenCarousel;
