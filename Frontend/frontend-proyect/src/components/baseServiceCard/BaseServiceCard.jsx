import React from "react";
import { Card } from "react-bootstrap";
import StarRating from "./../starRating/StarRating";
import "./baseServiceCard.css";

const BaseServiceCard = ({
  image,
  title,
  description,
  price,
  rating,
  reviewsCount,
  children,
  onClick,
}) => {
  return (
    <Card className="base-service-card shadow" onClick={onClick}>
      <Card.Img
        variant="top"
        src={image}
        alt={title}
        className="service-image"
      />
      <Card.Body>
        <Card.Title className="fw-bold">{title}</Card.Title>
        <Card.Text className="card-text">{description}</Card.Text>
        <Card.Text className="card-price fw-bold">${price} </Card.Text>
        <div>
          <StarRating rating={rating} reviewsCount={reviewsCount} />
        </div>
        {children}
      </Card.Body>
    </Card>
  );
};

export default BaseServiceCard;
