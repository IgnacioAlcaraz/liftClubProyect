import React from "react";
import "./reviewMetrics.css";

const ReviewMetrics = ({
  averageRating,
  totalReviews,
  totalResponses,
  reviews,
}) => {
  return (
    <div className="review-metrics">
      <div className="metrics-boxes">
        <div className="metric-box">
          <div className="metric-title fw-bold">Puntuación</div>
          <div className="metric-value">{Number(averageRating).toFixed(1)}</div>
        </div>
        <div className="metric-box">
          <div className="metric-title fw-bold">Reseñas</div>
          <div className="metric-value">{totalReviews}</div>
        </div>
        <div className="metric-box">
          <div className="metric-title fw-bold">Respuestas</div>
          <div className="metric-value">{totalResponses}</div>
        </div>
      </div>
      <div className="comments-container">
        <h3>Comentarios</h3>
        <div className="comments-list">
          {reviews.map((review) => (
            <p key={review._id}>{review.comment}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewMetrics;
