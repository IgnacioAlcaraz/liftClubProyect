import React from "react";
import { Plus } from "lucide-react";
import "./AddServiceCard.css";

const AddServiceCard = ({ onAddClick }) => {
  return (
    <div className="card-add-service shadow text-center m-2">
      <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto">
        <Plus size={80} color="#7749F8" />
      </div>
      <div className="card-body">
        <h5 className="card-add-service-title fw-bold">Agregar Servicio</h5>
        <p className="card-add-service-text text-secondary mb-4">
          Crear un nuevo servicio para ofrecer
        </p>
        <button className="btn-add-service" onClick={onAddClick}>
          Agregar Servicio
        </button>
      </div>
    </div>
  );
};

export default AddServiceCard;
