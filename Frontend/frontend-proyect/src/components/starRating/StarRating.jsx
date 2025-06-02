import React from "react";
import "./starRating.css";
import { Star } from "lucide-react";

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {Array.from({ length: Math.round(rating) }).map((_, idx) => (
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
