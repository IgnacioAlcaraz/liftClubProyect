import React, { useState } from "react";
import "./AvailabilitySection.css";
import { Button } from "react-bootstrap";
import SecondaryButton from "../../../secondaryButton/SecondaryButton";

const AvailabilitySection = ({ availabilities, onAvailabilityChange }) => {
  const [newAvailability, setNewAvailability] = useState({
    date: "",
    startTime: "",
    endTime: "",
  });

  const daysOfWeek = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const usedDays = availabilities.map((a) => a.date);
  const availableDays = daysOfWeek.filter((day) => !usedDays.includes(day));

  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    return `${hour}:00`;
  });

  const handleAddAvailability = () => {
    const updatedAvailabilities = [...availabilities, newAvailability];
    onAvailabilityChange(updatedAvailabilities);
    setNewAvailability({
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleRemoveAvailability = (index) => {
    const updatedAvailabilities = availabilities.filter((_, i) => i !== index);
    onAvailabilityChange(updatedAvailabilities);
  };

  return (
    <div className="availability-section">
      <h3>Disponibilidad</h3>

      <div className="add-availability-form">
        <select
          value={newAvailability.date}
          onChange={(e) =>
            setNewAvailability({ ...newAvailability, date: e.target.value })
          }
          className="form-control"
        >
          <option value="">Seleccione un día</option>
          {availableDays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <select
          value={newAvailability.startTime}
          onChange={(e) =>
            setNewAvailability({
              ...newAvailability,
              startTime: e.target.value,
            })
          }
          className="form-control"
        >
          <option value="">Hora inicio</option>
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <select
          value={newAvailability.endTime}
          onChange={(e) =>
            setNewAvailability({ ...newAvailability, endTime: e.target.value })
          }
          className="form-control"
        >
          <option value="">Hora fin</option>
          {hours.map((hour) => (
            <option key={hour} value={hour}>
              {hour}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleAddAvailability}
          className="btn btn-success w-100"
        >
          Agregar
        </button>
      </div>

      <div className="availabilities-list">
        {availabilities.map((availability, index) => (
          <div key={index} className="availability-item">
            <span>{availability.date}</span>
            <span>
              {availability.startTime} - {availability.endTime}
            </span>
            <Button
              type="button"
              onClick={() => handleRemoveAvailability(index)}
              className="btn btn-danger"
            >
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySection;
