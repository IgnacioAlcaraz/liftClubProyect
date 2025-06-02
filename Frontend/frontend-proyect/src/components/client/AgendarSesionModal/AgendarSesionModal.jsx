import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Calendar } from "lucide-react";
import axios from "axios";

const AgendarSesionModal = ({ contrato, show, onHide, onAgendar }) => {
  // Estados locales
  const [dia, setDia] = useState(""); // Día seleccionado (YYYY-MM-DD)
  const [horaSeleccionada, setHoraSeleccionada] = useState(""); // Hora elegida
  const [loading, setLoading] = useState(false); // Estado de carga del botón
  const [horariosDisponibles, setHorariosDisponibles] = useState([]); // Horarios según el día

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
    const fecha = new Date(fechaStr);
    return dias[fecha.getDay()];
  };

  // Al abrir el modal, resetear campos
  useEffect(() => {
    if (show) {
      setDia("");
      setHoraSeleccionada("");
      setHorariosDisponibles([]);
    }
  }, [show]);

  // Cada vez que se selecciona un día, buscar disponibilidad en el contrato
  useEffect(() => {
    if (!dia || !contrato?.serviceId?.availability) return;

    // Obtener el nombre del día (por ej. "Martes")
    const nombreDelDia = obtenerNombreDia(dia);

    // Buscar disponibilidad para ese día de la semana
    const disponibilidad = contrato.serviceId.availability.find(
      (d) => d.date === nombreDelDia
    );

    // Si hay disponibilidad, generar lista de horarios en bloques de 1 hora
    if (disponibilidad) {
      const horaInicio = parseInt(disponibilidad.startTime.split(":")[0]);
      const horaFin = parseInt(disponibilidad.endTime.split(":")[0]);
      const horarios = [];

      for (let h = horaInicio; h < horaFin; h++) {
        horarios.push(`${h}:00`);
      }

      setHorariosDisponibles(horarios);
    } else {
      setHorariosDisponibles([]); // Si no hay disponibilidad, limpiar lista
    }
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

      await axios.post(
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

      alert("Sesión agendada con éxito");
      if (onAgendar) onAgendar(); // Callback para actualizar la UI
      onHide(); // Cerrar modal
    } catch (err) {
      console.error("Error al agendar sesión:", err);
      alert("Error al agendar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Calendar className="me-2" /> Agendar sesión de entrenamiento
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Selector de fecha */}
        <Form.Group className="mb-3">
          <Form.Label>Seleccioná día</Form.Label>
          <Form.Control
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          />
        </Form.Group>

        {/* Mostrar horarios disponibles */}
        {horariosDisponibles.length > 0 ? (
          <>
            <p className="mb-2">Horarios disponibles:</p>
            <div className="d-flex flex-wrap gap-2">
              {horariosDisponibles.map((hora) => (
                <Button
                  key={hora}
                  variant={
                    horaSeleccionada === hora ? "primary" : "outline-secondary"
                  }
                  onClick={() => setHoraSeleccionada(hora)}
                >
                  {hora}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted">
            No hay horarios disponibles para este día.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleConfirmar} disabled={loading}>
          {loading ? "Agendando..." : "Confirmar Cita"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AgendarSesionModal;
