import React from "react";
import "./ComentarioItem.css"; 

const ComentarioItem = ({ comentario }) => {
  return (
    <div className="mb-4">
      <div className="comentario-autor">{comentario.author}</div>
      <p className="comentario-texto mb-2">{comentario.text}</p>

      {comentario.reply && (
        <div className="comentario-respuesta">
          <strong>Respuesta:</strong> <span>{comentario.reply}</span>
        </div>
      )}
    </div>
  );
};

export default ComentarioItem;
