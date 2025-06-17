import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

const Pagination = ({
  currentPage,
  itemsPerPage,
  items = [],
  onPageChange,
  renderItem,
}) => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className="items-list">
        {currentItems.map((item, index) =>
          renderItem(item, index + startIndex)
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <div className="pagination-controls">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-button"
              aria-label="Página anterior"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="pagination-info">
              <span className="current-page">{currentPage}</span>
              <span className="page-divider">de</span>
              <span className="total-pages">{totalPages}</span>
              <span className="total-items">({totalItems} comentarios)</span>
            </div>

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-button"
              aria-label="Página siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Pagination;
