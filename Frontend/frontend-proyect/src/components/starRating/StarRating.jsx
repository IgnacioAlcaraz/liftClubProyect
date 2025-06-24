import React from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, reviewsCount }) => {
  // Si no hay reseñas, mostramos un texto alternativo
  if (!reviewsCount || reviewsCount === 0) {
    return <span className="text-muted">Sin calificaciones</span>;
  }

  // Redondeamos el promedio a la estrella más cercana
  const roundedRating = Math.round(rating);

  return (
    <div className="star-rating d-flex align-items-center">
      {Array.from({ length: roundedRating }).map((_, idx) => (
        <Star
          key={idx}
          size={16}
          fill="#ffc107"
          stroke="#ffc107"
          className="me-1"
        />
      ))}
    </div>
  );
};

export default StarRating;
