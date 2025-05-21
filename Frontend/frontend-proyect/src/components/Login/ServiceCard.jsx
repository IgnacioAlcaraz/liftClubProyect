import React from "react";

const ServiceCard = ({
  image,
  title,
  coachName,
  description,
  price,
  rating,
}) => {
  return (
    <div
      className="card shadow-sm m-2"
      style={{ width: "18rem", borderRadius: "1rem" }}
    >
      <img
        src={image}
        className="card-img-top"
        alt={title}
        style={{
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
          height: "180px",
          objectFit: "cover",
        }}
      />
      <div className="card-body">
        <h5 className="card-title fw-bold">{title}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{coachName}</h6>
        <p className="card-text text-secondary" style={{ fontSize: "0.95rem" }}>
          {description}
        </p>
        <div className="mb-2">
          {Array.from({ length: rating }).map((_, i) => (
            <i className="bi bi-star-fill text-warning" key={i}></i>
          ))}
        </div>
        <p className="fw-semibold fs-5">{price} USD</p>
      </div>
    </div>
  );
};

export default ServiceCard;
