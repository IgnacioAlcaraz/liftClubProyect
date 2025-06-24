import React from "react";
import { Calendar, Globe, MapPin, Camera, Tag } from "lucide-react";
import "./ReservaServicioCard.css";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../secondaryButton/SecondaryButton";
const ReservaServicioCard = ({ servicio }) => {
  const navigate = useNavigate();


  const handleReservar = () => {
    // Navegamos a la pantalla de pago usando el ID del servicio
    navigate(`/client-page-pago/${servicio._id}`);
  };

  return (
    <div className="reserva-card-v2 shadow-sm rounded">
      <h3 className="titulo">Reserva tu servicio</h3>

      <div className="precio bg-purple-light">
        <p className="label">Precio final</p>
        <h4 className="monto">${servicio.price}</h4>
      </div>

      <div className="info">
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
      </div>

      <div className="contenido-secundario">
        <h6>Descripcion</h6>
        <p>{servicio.description}</p>

        <h6>Disponibilidad Horaria:</h6>
        <ul className="list-unstyled">
          {servicio.availability?.map((a, i) => (
            <li key={i}>
              {console.log(a.date)}
              {(a.date)}: de {a.startTime} hasta {a.endTime}
            </li>
          ))}
        </ul>
      </div>

      <div className="boton-container">
        <SecondaryButton
          texto="Contratar Servicio"
          className="mt-2 w-100"
          onClick={handleReservar}
        />
      </div>
    </div>
  );
};

export default ReservaServicioCard;
