import React from "react";
import { Calendar, Globe, MapPin, Camera, Tag } from "lucide-react"; // o tus íconos favoritos
import "./ReservaServicioCard.css";

const ReservaServicioCard = ({ servicio, onReservar }) => {
  return (
    <div className="card shadow-sm rounded reserva-card">
      <div className="p-3 bg-light-purple">
        <p
          className="mb-1 text-muted"
          style={{ fontSize: "13px", letterSpacing: "0.5px" }}
        >
          PRECIO FINAL
        </p>
        <h4 style={{ fontWeight: 700, fontSize: "20px" }}>
          {servicio.price} USD
        </h4>
      </div>

      <div className="p-3">
        <div className="info-row">
          <Tag className="icon" />
          <span>
            <strong>Categoría</strong> {servicio.category}
          </span>
        </div>
        <div className="info-row">
          <Camera className="icon" />
          <span>
            <strong>Modalidad</strong> {servicio.modality}
          </span>
        </div>
        <div className="info-row">
          <Calendar className="icon" />
          <span>
            <strong>Duración</strong> {servicio.duration} Sesiones
          </span>
        </div>
        <div className="info-row">
          <MapPin className="icon" />
          <span>
            <strong>Zona</strong> {servicio.zone}
          </span>
        </div>
        <div className="info-row">
          <Globe className="icon" />
          <span>
            <strong>Idioma</strong> {servicio.idiom}
          </span>
        </div>

        <hr />

        <h6>Descripción</h6>
        <p>{servicio.description}</p>

        <h6>Disponibilidad Horaria:</h6>
        <ul className="list-unstyled">
          {servicio.schedule?.map((slot, i) => (
            <li key={i}>
              {slot.day}: de {slot.from} hasta {slot.to}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-3">
        <button className="btn btn-primary w-100" onClick={onReservar}>
          Contratar Servicio
        </button>
      </div>
    </div>
  );
};

export default ReservaServicioCard;
