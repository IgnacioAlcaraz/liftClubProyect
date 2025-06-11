import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { FileText } from "lucide-react";

export default function ArchivosModal({ show, onHide, contrato, isCoach }) {
  const fileInputRef = useRef(null);
  if (!contrato) return null;

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/contracts/${contrato._id}/files`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al subir los archivos");
      }

      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al subir los archivos");
    }
  };

  const handleDownload = async (archivo) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/contracts/${contrato._id}/files/${archivo.name}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = archivo.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("Error al descargar el archivo");
    }
  };

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
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownload(archivo);
                    }}
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
        {isCoach && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
            <Button variant="primary" onClick={handleUploadClick}>
              Subir Archivos
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
