import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { Calendar } from "lucide-react";

const AgendarSesionModal = ({ contrato, show, onHide, onAgendar }) => {
  const [dia, setDia] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [loading, setLoading] = useState(false);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

  const token = localStorage.getItem("token");

  // Resetear campos cada vez que se abre el modal
  useEffect(() => {
    if (show) {
      setDia("");
      setHoraSeleccionada("");
      setHorariosDisponibles([]);
    }
  }, [show]);

  // Cuando se cambia la fecha, buscar horarios disponibles
  useEffect(() => {
    if (!dia || !contrato?.serviceId?.availability) return;

    const disponibilidad = contrato.serviceId.availability.find(
      (d) => d.date === dia
    );

    if (disponibilidad) {
      const horaInicio = parseInt(disponibilidad.startTime.split(":")[0]);
      const horaFin = parseInt(disponibilidad.endTime.split(":")[0]);
      const horarios = [];

      for (let h = horaInicio; h < horaFin; h++) {
        horarios.push(`${h}:00`);
      }

      setHorariosDisponibles(horarios);
    } else {
      setHorariosDisponibles([]);
    }
  }, [dia, contrato]);

  const handleConfirmar = async () => {
    if (!dia || !horaSeleccionada) {
      alert("Seleccioná un día y horario");
      return;
    }

    if (!contrato || !contrato._id) {
      alert("Contrato no válido");
      return;
    }

    const formattedDate = dia; // ya es YYYY-MM-DD
    const startTime = horaSeleccionada;
    const endTime = `${parseInt(horaSeleccionada) + 1}:00`;

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:5000/api/contracts/${contrato._id}/scheduledSessions`,
        {
          date: formattedDate,
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
      if (onAgendar) onAgendar();
      onHide();
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
        <Form.Group className="mb-3">
          <Form.Label>Seleccioná día</Form.Label>
          <Form.Control
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
          />
        </Form.Group>

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
