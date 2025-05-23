import React from "react";
import "./ServiceCardCoach.css";
import { Edit, Trash2, Star } from "lucide-react";

const ServiceCardCoach = ({ service, onEdit, onDelete }) => {
  const getImageUrl = () => {
    if (service.images && service.images.length > 0) {
      const imageUrl = `http://localhost:5000${service.images[0].url}`;
      return imageUrl;
    }
    return;
  };

  return (
    <div className="card shadow m-2">
      <img src={getImageUrl()} className="card-img-top" alt={service.name} />
      <div className="card-body">
        <h5 className="card-title fw-bold">{service.name}</h5>
        <p className="card-text text-secondary">{service.description}</p>
        <div className="mb-2">
          {Array.from({ length: service.averageRating || 5 }).map(
            (_, index) => (
              <Star
                key={index}
                fill="#ffc107"
                stroke="#ffc107"
                className="me-1"
                size={18}
              />
            )
          )}
        </div>
        <div className="d-flex justify-content-between mt-3">
          <button className="btn-edit-service" onClick={() => onEdit(service)}>
            <Edit size={18} /> Editar
          </button>
          <button
            className="btn-delete-service"
            onClick={() => onDelete(service._id)}
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardCoach;
