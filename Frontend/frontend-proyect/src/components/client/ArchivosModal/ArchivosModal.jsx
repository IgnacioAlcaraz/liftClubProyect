import React, { useRef } from "react";
import { Button } from "react-bootstrap";
import { FileText } from "lucide-react";
import BaseModal from "../../baseModal/BaseModal";
import SecondaryButton from "../../secondaryButton/SecondaryButton";

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
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/contracts/${contrato._id}/files`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al subir los archivos");
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
    <BaseModal
      show={show}
      onClose={onHide}
      title="Archivos Subidos"
      footer={
        <div className="gap-2 w-100 d-flex justify-content-end">
          {isCoach && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <SecondaryButton
                texto="Subir Archivos"
                onClick={handleUploadClick}
              />
            </>
          )}
          <Button className="btn-secondary" onClick={onHide}>
            Cerrar
          </Button>
        </div>
      }
    >
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
        <p>No hay archivos subidos para este contrato.</p>
      )}
    </BaseModal>
  );
}
