import React from "react";
import CoachOverview from "./coachOverview/CoachOverview";
import ReviewMetrics from "./reviewMetrics/ReviewMetrics";

const ReviewPanel = ({
  averageRating,
  totalReviews,
  totalResponses,
  reviews,
}) => {
  return (
    <div className="review-panel">
      <h2>Reseñas recibidas</h2>
      <CoachOverview
        averageRating={averageRating}
        totalReviews={totalReviews}
      />
      <ReviewMetrics
        averageRating={averageRating}
        totalReviews={totalReviews}
        totalResponses={totalResponses}
        reviews={reviews}
      />
    </div>
  );
};

export default ReviewPanel;
