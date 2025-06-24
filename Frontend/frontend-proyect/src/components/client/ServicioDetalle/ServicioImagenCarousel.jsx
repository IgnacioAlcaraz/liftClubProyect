import React from "react";
import { Carousel } from "react-bootstrap";

const ServicioImagenCarousel = ({ imagenes = [] }) => {
  if (!imagenes.length || !imagenes[0].url) return null;

  return (
    <div style={{ width: "100%", maxHeight: "300px", overflow: "hidden" }}>
      <Carousel interval={3000} indicators={true}>
        {imagenes.map((imagen, index) => (
          <Carousel.Item key={index}>
            <img
              src={`http://localhost:5000${imagen.url}`}
              alt={`Imagen ${index + 1} del servicio`}
              className="img-fluid w-100"
              style={{
                objectFit: "cover",
                height: "300px",
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ServicioImagenCarousel;
