import React, { useState } from "react";
import "./ComentarioItem.css";
import SecondaryButton from "../../secondaryButton/SecondaryButton";
import InputField from "../../input/InputField";
import axios from "axios";

const ComentarioItem = ({ comentario, isCoach = false }) => {
  const [showTextarea, setShowTextarea] = useState(false);
  const [reply, setReply] = useState("");
  const token = localStorage.getItem("token");

  const handleReply = async () => {
    await axios.patch(
      `http://localhost:5000/api/reviews/${comentario._id}`,
      {
        trainerResponse: reply,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
    setShowTextarea(false);
    window.location.reload();
  };

  return (
    <div className="mb-4">
      <div className="comentario-autor">{comentario.author}</div>
      <p className="comentario-texto mb-2">{comentario.text}</p>

      {comentario.reply && (
        <div className="comentario-respuesta">
          <strong>Respuesta:</strong> <span>{comentario.reply}</span>
        </div>
      )}

      {isCoach && comentario.reply === "" && !showTextarea && (
        <SecondaryButton
          texto="Responder"
          onClick={() => setShowTextarea(true)}
        />
      )}

      {showTextarea && (
        <div className="reply-textarea">
          <InputField
            placeholder="Escribe tu respuesta"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <div className="d-flex gap-2 mt-2">
            <SecondaryButton texto="Enviar" onClick={handleReply} />
            <button
              className="btn btn-secondary"
              onClick={() => setShowTextarea(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComentarioItem;
