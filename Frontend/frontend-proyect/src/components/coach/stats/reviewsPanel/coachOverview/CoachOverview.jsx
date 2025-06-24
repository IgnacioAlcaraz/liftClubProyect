import React from "react";
import { useSelector } from "react-redux";
import StarRating from "../../../../starRating/starRating";
import "./coachOverview.css";

const CoachOverview = ({ averageRating, totalReviews }) => {
  const { user } = useSelector((state) => state.auth);

  const userData = user || JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="coach-overview">
      <div className="coach-info">
        <h3 className="fw-bold">
          {userData.firstName} {userData.lastName}
        </h3>
        <div className="coach-rating">
          <StarRating rating={averageRating || 0} reviewsCount={totalReviews} />
          <p>{Number(averageRating || 0).toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default CoachOverview;
