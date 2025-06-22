import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import RatingDropdown from "../ratingDropDown/RatingDropDown";
import BaseModal from "../../baseModal/BaseModal";
import SecondaryButton from "../../secondaryButton/SecondaryButton";

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
      setRating("");
      setComentario("");
    }
  }, [show]);

  const handleSubmit = () => {
    if (!rating) return alert("Seleccioná una calificación.");
    onSubmit({ contratoId: contrato._id, rating, comentario });
    onHide();
  };

  if (!contrato) return null;

  return (
    <BaseModal
      show={show}
      onClose={onHide}
      title={`Calificar Servicio de ${contrato.coachId.firstName} ${contrato.coachId.lastName}`}
      footer={
        <div className="gap-2 w-100 d-flex justify-content-end">
          <SecondaryButton texto="Enviar Reseña" onClick={handleSubmit} />
          <Button className="btn btn-secondary" onClick={onHide}>
            Cancelar
          </Button>
        </div>
      }
    >
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
    </BaseModal>
  );
}
