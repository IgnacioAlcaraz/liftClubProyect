import React from "react";
import { Edit, Trash2 } from "lucide-react";
import BaseServiceCard from "../../baseServiceCard/BaseServiceCard";
import "./serviceCardCoach.css";
import "../../baseServiceCard/baseServiceCard.css";

const ServiceCardCoach = ({ service, onEdit, onDelete }) => {
  return (
    <BaseServiceCard
      image={
        service.images?.[0]?.url
          ? `http://localhost:5000${service.images[0].url}`
          : null
      }
      title={service.name}
      description={service.description}
      price={service.price}
      rating={service.averageRating || 0}
      reviewsCount={service.reviews?.length || 0} // ✅ AÑADIR ESTO
      onClick={() => {}}
    >
      <div className="d-flex justify-content-between mt-2">
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
    </BaseServiceCard>
  );
};

export default ServiceCardCoach;
