import React from "react";

const ComentarioItem = ({ comentario }) => {
  return (
    <div className="mb-3 border-bottom pb-2">
      <strong>{comentario.author}</strong>
      <p className="mb-1">{comentario.text}</p>

      {comentario.reply && (
        <div className="bg-light border-start border-3 border-primary p-2">
          <strong>Respuesta:</strong> <span>{comentario.reply}</span>
        </div>
      )}
    </div>
  );
};

export default ComentarioItem;
