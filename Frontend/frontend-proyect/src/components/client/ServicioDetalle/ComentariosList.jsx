import React, { useState } from "react";
import ComentarioItem from "./ComentarioItem";
import Pagination from "../../pagination/Pagination";

const ComentariosList = ({ comentarios = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  return (
    <div className="px-3">
      <h5 className="fw-bold mb-3">Comentarios</h5>

      {comentarios.length === 0 ? (
        <p>No hay comentarios aún.</p>
      ) : (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          items={comentarios}
          onPageChange={setCurrentPage}
          renderItem={(comentario, index) => (
            <ComentarioItem key={index} comentario={comentario} />
          )}
        />
      )}
    </div>
  );
};

export default ComentariosList;
