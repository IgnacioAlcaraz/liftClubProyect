import React, { useState } from "react";
import "./reviewMetrics.css";
import ComentarioItem from "../../../../client/servicioDetalle/ComentarioItem";
import Pagination from "../../../../pagination/Pagination";

const ReviewMetrics = ({
  averageRating,
  totalReviews,
  totalResponses,
  reviews,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          items={formattedReviews}
          onPageChange={setCurrentPage}
          renderItem={(review) => (
            <ComentarioItem
              key={review._id}
              comentario={review}
              isCoach={true}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ReviewMetrics;
