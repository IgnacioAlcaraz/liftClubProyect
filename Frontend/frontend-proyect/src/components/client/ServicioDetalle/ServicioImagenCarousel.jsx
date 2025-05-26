import React from "react";

const ServicioImagenCarousel = ({ imagenes = [] }) => {
  const imagenSrc = imagenes[0] || "https://via.placeholder.com/600x300";

  return (
    <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
      <img
        src={imagenSrc}
        alt="Servicio"
        className="img-fluid w-100 h-100"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
};

export default ServicioImagenCarousel;
