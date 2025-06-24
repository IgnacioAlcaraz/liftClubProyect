import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import BaseServiceCard from "../../baseServiceCard/BaseServiceCard";

const ServiceCard = ({
  id,
  image,
  title,
  coachName,
  description,
  rating,
  price,
  isGuest,
  reviewsCount,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isGuest) {
      navigate(`/login`);
    } else {
      navigate(`/client-page-servicio1/${id}`);
    }
  };

  return (
    <BaseServiceCard
      image={image}
      title={title}
      description={description}
      price={price}
      rating={rating}
      reviewsCount={reviewsCount}
      onClick={handleClick}
    >
      <Card.Subtitle style={{ paddingTop: "8px" }} className="mb-2">
        {coachName}
      </Card.Subtitle>
      <Card.Text className="fw-bold">{}</Card.Text>
    </BaseServiceCard>
  );
};

export default ServiceCard;
