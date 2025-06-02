import React from "react";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "../../../../starRating/StarRating";
import "./coachOverview.css";

const CoachOverview = ({ averageRating }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const [coach, setCoach] = useState({});

  const getCoach = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoach(response.data);
    } catch (error) {
      console.error("Error obteniendo coach:", error);
    }
  };

  useEffect(() => {
    getCoach();
  }, []);

  return (
    <div className="coach-overview">
      <div className="coach-info">
        <h3 className="fw-bold">
          {coach.firstName} {coach.lastName}
        </h3>
        <div className="coach-rating">
          <StarRating rating={averageRating || 0} />
          <p>{Number(averageRating || 0).toFixed(1)}</p>
        </div>
      </div>
    </div>
  );
};

export default CoachOverview;
