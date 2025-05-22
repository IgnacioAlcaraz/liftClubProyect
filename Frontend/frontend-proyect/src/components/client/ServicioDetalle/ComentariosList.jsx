import React, { useState } from "react";
import ComentarioItem from "./ComentarioItem";

const ComentariosList = ({ comentarios = [] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 2;

  const totalPages = Math.ceil(comentarios.length / pageSize);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const startIndex = currentPage * pageSize;
  const currentComentarios = comentarios.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="px-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">Comentarios</h5>
        {totalPages > 1 && (
          <div>
            <button
              onClick={handlePrev}
              disabled={currentPage === 0}
              className="btn btn-sm me-2"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className="btn btn-sm"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {currentComentarios.length === 0 ? (
        <p>No hay comentarios aún.</p>
      ) : (
        currentComentarios.map((c, i) => (
          <ComentarioItem key={i + startIndex} comentario={c} />
        ))
      )}
    </div>
  );
};

export default ComentariosList;
