import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Calendar } from "lucide-react";
import axios from "axios";
import BaseModal from "../../baseModal/BaseModal";
import SecondaryButton from "../../secondaryButton/SecondaryButton";

const AgendarSesionModal = ({ contrato, show, onHide, onAgendar }) => {
  // Estados locales
  const [dia, setDia] = useState(""); // Día seleccionado (YYYY-MM-DD)
  const [horaSeleccionada, setHoraSeleccionada] = useState(""); // Hora elegida
  const [loading, setLoading] = useState(false); // Estado de carga del botón
  const [horariosDisponibles, setHorariosDisponibles] = useState([]); // Horarios según el día
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  const token = localStorage.getItem("token");

  // Función para convertir fecha YYYY-MM-DD en nombre del día ("Lunes", "Martes", etc.)
  const obtenerNombreDia = (fechaStr) => {
    const dias = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const [year, month, day] = fechaStr.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, Number(day));
    return dias[fecha.getDay()];
  };

  const fetchHorasOcupadas = async (fecha) => {
    if (!contrato?.serviceId?._id || !fecha) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/services/${contrato.serviceId._id}/occupiedSessions`,
        {
          params: { date: fecha },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const horas = response.data.map((s) =>
        parseInt(s.startTime.split(":")[0])
      );
      setHorasOcupadas(horas);
    } catch (error) {
      console.error("Error al obtener horas ocupadas:", error);
      setHorasOcupadas([]);
    }
  };

  // Al abrir el modal, resetear campos
  useEffect(() => {
    if (show) {
      setDia("");
      setHoraSeleccionada("");
      setHorariosDisponibles([]);
    }
  }, [show]);

  useEffect(() => {
    const actualizarHorariosDisponibles = async () => {
      if (!dia || !contrato?.serviceId?.availability) return;

      // traemos los horarios ocupados
      const response = await axios.get(
        `http://localhost:5000/api/services/${contrato.serviceId._id}/occupiedSessions`,
        {
          params: { date: dia },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const ocupadas = response.data.map((s) =>
        parseInt(s.startTime.split(":")[0])
      );

      const nombreDelDia = obtenerNombreDia(dia);

      const disponibilidad = contrato.serviceId.availability.find(
        (d) => d.date === nombreDelDia
      );

      if (disponibilidad) {
        const horaInicio = parseInt(disponibilidad.startTime.split(":")[0]);
        const horaFin = parseInt(disponibilidad.endTime.split(":")[0]);
        const horarios = [];

        for (let h = horaInicio; h < horaFin; h++) {
          if (!ocupadas.includes(h)) {
            horarios.push(`${h}:00`);
          }
        }

        setHorariosDisponibles(horarios);
      } else {
        setHorariosDisponibles([]);
      }
    };

    actualizarHorariosDisponibles();
  }, [dia, contrato]);

  // Confirmar la reserva de la sesión
  const handleConfirmar = async () => {
    if (!dia || !horaSeleccionada) {
      alert("Seleccioná un día y horario");
      return;
    }

    if (!contrato || !contrato._id) {
      alert("Contrato no válido");
      return;
    }

    // Datos para enviar al backend (guardamos la fecha real, no el nombre del día)
    const startTime = horaSeleccionada;
    const endTime = `${parseInt(horaSeleccionada) + 1}:00`;

    try {
      setLoading(true);

      const response = await axios.post(
        `http://localhost:5000/api/contracts/${contrato._id}/scheduledSessions`,
        {
          date: dia, // Guardamos como YYYY-MM-DD
          startTime,
          endTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Sesión agendada:", response.data);

      if (onAgendar) onAgendar(); // Callback para actualizar la UI
      onHide(); // Cerrar modal
    } catch (err) {
      console.error("Error al agendar sesión:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      show={show}
      onClose={onHide}
      title="Agendar sesión de entrenamiento"
      footer={
        <div className="gap-2 w-100 d-flex justify-content-end">
          <SecondaryButton texto="Confirmar Cita" onClick={handleConfirmar} />
          <Button className="btn btn-secondary" onClick={onHide}>
            Cerrar
          </Button>
        </div>
      }
    >
      <Form.Group className="mb-3">
        <Form.Label>Seleccioná día</Form.Label>
        <Form.Control
          type="date"
          min={new Date().toISOString().split("T")[0]}
          value={dia}
          onChange={(e) => setDia(e.target.value)}
        />
      </Form.Group>

      {horariosDisponibles.length > 0 ? (
        <>
          <p className="mb-2">Horarios disponibles:</p>
          <div className="d-flex flex-wrap gap-2">
            {horariosDisponibles.map((hora) => (
              <button
                key={hora}
                type="button"
                className={`btn ${
                  horaSeleccionada === hora
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setHoraSeleccionada(hora)}
              >
                {hora}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-muted">No hay horarios disponibles para este día.</p>
      )}
    </BaseModal>
  );
};

export default AgendarSesionModal;
