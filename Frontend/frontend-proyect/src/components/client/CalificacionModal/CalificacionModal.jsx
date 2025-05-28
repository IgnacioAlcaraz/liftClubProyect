import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import RatingDropdown from "../ratingDropDown/RatingDropDown";

export default function CalificacionModal({
  show,
  onHide,
  contrato,
  onSubmit,
}) {
  const [rating, setRating] = useState("");
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    if (show) {
      // Reseteamos los campos cada vez que se abre
      setRating("");
      setComentario("");
    }
  }, [show]);

  const handleSubmit = () => {
    if (!rating) return alert("Seleccioná una calificación.");
    onSubmit({ contratoId: contrato._id, rating, comentario });

    onHide(); // Cerramos el modal luego del envío
  };

  if (!contrato) return null;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Calificar Servicio de {contrato.coachId.firstName}{" "}
          {contrato.coachId.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Servicio:</strong> {contrato.serviceId.name}
        </p>

        <Form.Group className="mb-3">
          <Form.Label>Reseña en estrellas</Form.Label>
          <RatingDropdown value={rating} onChange={setRating} />
        </Form.Group>

        <Form.Group>
          <Form.Label>Reseña escrita (opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Enviar Reseña
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
