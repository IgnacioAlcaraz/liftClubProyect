import React from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Card from "react-bootstrap/Card";
import "./serviceCard.css";
import StarRating from "../../starRating/starRating";

const ServiceCard = ({
  id,
  image,
  title,
  coachName,
  description,
  rating,
  price,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/client-page-servicio1/${id}`);
  };

  return (
    <Card
      onClick={handleClick}
      style={{ width: "18rem", cursor: "pointer" }}
      className="shadow"
    >
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        style={{ height: "180px", objectFit: "cover" }}
      />
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Subtitle className="mb-1 text-muted">{coachName}</Card.Subtitle>
        <Card.Text style={{ fontSize: "0.9rem" }}>{description}</Card.Text>

        <div className="mb-2">
          <StarRating rating={rating} />
        </div>

        <Card.Text className="fw-bold">{price} USD</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ServiceCard;
