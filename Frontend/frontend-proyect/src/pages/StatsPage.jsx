import React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ReviewPanel from "../components/coach/stats/reviewsPanel/ReviewPanel";
import VisitPanel from "../components/coach/stats/visitPanel/VisitPanel";
import HeaderCoach from "../components/coach/headerCoach/headerCoach";
import "../App.css";

const StatsPage = () => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const [stats, setStats] = useState({});
  const [reviewsData, setReviewsData] = useState({
    reviews: [],
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [totalResponses, setTotalResponses] = useState(0);

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const coachId = decodedToken.userId;

  const getStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
    }
  };

  const getReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/reviews/coach/${coachId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || {};
      const reviews = Array.isArray(data.reviews) ? data.reviews : [];

      setReviewsData({
        reviews: reviews,
        total: reviews.length || 0,
      });

      const responses = reviews.reduce((total, review) => {
        return (
          total +
          (review.trainerResponse && review.trainerResponse !== "" ? 1 : 0)
        );
      }, 0);

      setTotalResponses(responses);
      console.log("Reviews obtenidas:", reviews);
    } catch (error) {
      console.error("Error obteniendo reseñas:", error);
    }
  };

  useEffect(() => {
    getStats();
    getReviews();
  }, []);

  return (
    <div>
      <HeaderCoach />
      <div className="stats-layout mt-4">
        <div className="stats-grid">
          <div className="stats-panel shadow">
            <ReviewPanel
              averageRating={stats?.averageRating || 0}
              totalReviews={reviewsData?.total || 0}
              totalResponses={totalResponses}
              reviews={reviewsData?.reviews || []}
            />
          </div>
          <div className="stats-panel shadow">
            <VisitPanel
              totalViews={stats?.views || 0}
              conversionRate={stats?.conversionRate || 0}
              conversionRatePerService={stats?.conversionRatePerService}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
