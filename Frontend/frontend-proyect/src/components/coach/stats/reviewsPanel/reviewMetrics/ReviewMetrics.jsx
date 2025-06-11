import React from "react";
import "./reviewMetrics.css";
import ComentarioItem from "../../../../client/ServicioDetalle/ComentarioItem";

const ReviewMetrics = ({
  averageRating,
  totalReviews,
  totalResponses,
  reviews,
}) => {
  const formattedReviews = reviews.map((review) => ({
    _id: review._id,
    author: `${review.clientId?.firstName || "Usuario"} ${
      review.clientId?.lastName || ""
    }`,
    text: review.comment,
    reply: review.trainerResponse,
  }));

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
          {formattedReviews.map((review) => (
            <ComentarioItem
              key={review._id}
              comentario={review}
              isCoach={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewMetrics;
