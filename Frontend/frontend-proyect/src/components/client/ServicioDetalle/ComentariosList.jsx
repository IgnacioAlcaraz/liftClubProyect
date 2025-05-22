import React from "react";
import ComentarioItem from "./ComentarioItem";

const ComentariosList = ({ comentarios = [] }) => {
  return (
    <div className="px-3">
      <h5 className="fw-bold">Comentarios</h5>
      {comentarios.length === 0 && <p>No hay comentarios aún.</p>}

      {comentarios.map((c, i) => (
        <ComentarioItem key={i} comentario={c} />
      ))}
    </div>
  );
};

export default ComentariosList;
