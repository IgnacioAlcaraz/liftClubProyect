import React, { useState } from "react";
import "./AvailabilitySection.css";

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
    if (
      !newAvailability.date ||
      !newAvailability.startTime ||
      !newAvailability.endTime
    ) {
      alert("Por favor complete todos los campos de disponibilidad");
      return;
    }

    const start = parseInt(newAvailability.startTime.split(":")[0]);
    const end = parseInt(newAvailability.endTime.split(":")[0]);

    if (end <= start) {
      alert("La hora de fin debe ser mayor que la hora de inicio");
      return;
    }

    if (usedDays.includes(newAvailability.date)) {
      alert("Ya existe una disponibilidad para este día");
      return;
    }

    const updatedAvailabilities = [...availabilities, newAvailability];
    onAvailabilityChange(updatedAvailabilities);
    setNewAvailability({ date: "", startTime: "", endTime: "" });
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
          className="btn-add-availability"
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
            <button
              type="button"
              onClick={() => handleRemoveAvailability(index)}
              className="btn-remove"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilitySection;
