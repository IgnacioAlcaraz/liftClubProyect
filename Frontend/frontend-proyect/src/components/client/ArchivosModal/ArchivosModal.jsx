import React from "react";
import { Modal, Button } from "react-bootstrap";
import { FileText } from "lucide-react";

export default function ArchivosModal({ show, onHide, contrato }) {
  if (!contrato) return null;

  const archivos = contrato.files || [];

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Archivos Subidos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {archivos.length > 0 ? (
          <>
            <p>Haz clic en un archivo para descargarlo:</p>
            <ul className="list-unstyled">
              {archivos.map((archivo, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={`http://localhost:5000/uploads/${archivo.path}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none d-flex align-items-center"
                  >
                    <FileText className="me-2 text-purple" size={20} />
                    {archivo.name}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No hay archivos subidos para este contrato. </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
