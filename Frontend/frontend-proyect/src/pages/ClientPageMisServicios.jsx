import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Star, FileText, Calendar, X } from "lucide-react"; // Íconos de lucide-react
import CalificacionModal from "../components/client/CalificacionModal/CalificacionModal";
import ArchivosModal from "../components/client/ArchivosModal/ArchivosModal";
import AgendarSesionModal from "../components/client/AgendarSesionModal/AgendarSesionModal";

export default function ClientPageMisServicios() {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const [misContratos, setMisContratos] = useState([]);
  const [error, setError] = useState(null);

  //estados para trabajar con los modal
  const [contratoActivo, setContratoActivo] = useState(null);

  const [showModalCalificar, setShowModalCalificar] = useState(false);

  const [showModalArchivos, setShowModalArchivos] = useState(false);

  const [showModalAgendar, setShowModalAgendar] = useState(false);

  useEffect(() => {
    const fetchMisContratos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/contracts/cliente/mis-contratos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data);
        setMisContratos(response.data);
      } catch (err) {
        setError("No se pudieron cargar los contratos.");
      }
    };

    if (token) fetchMisContratos();
  }, [token]);

  //funcion para enviar calificaciones al back
  const handleEnviarCalificacion = async ({
    contratoId,
    rating,
    comentario,
  }) => {
    try {
      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          contractId: contratoId,
          rating,
          comment: comentario,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("¡Calificación enviada con éxito!");
    } catch (error) {
      console.error("Error completo:", error);
      console.error("Mensaje del servidor:", error.response?.data);
      alert(error.response?.data?.message || "Error inesperado en el servidor");
    }
  };
  const handleCancelarContrato = async (contratoId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/contracts/${contratoId}`,
        { status: "Cancelado" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMisContratos((prev) =>
        prev.map((c) =>
          c._id === contratoId ? { ...c, status: "Cancelado" } : c
        )
      );
    } catch (error) {
      console.error("Error al cancelar contrato:", error);
      console.error("Detalle:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error al cancelar el contrato");
    }
  };

  const renderEstadoBadge = (estado) => {
    const estados = {
      Aceptado: "success",
      Pendiente: "warning",
      Completado: "primary",
      Cancelado: "danger",
    };
    return (
      <span className={`badge bg-${estados[estado] || "secondary"}`}>
        {estado}
      </span>
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Mis Servicios</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Profesor</th>
              <th>Servicio</th>
              <th>Estado</th>
              <th>Duración</th>
              <th>Calificar</th>
              <th>Archivos</th>
              <th>Agendar</th>
              <th>Cancelar</th>
            </tr>
          </thead>
          <tbody>
            {misContratos.map((c) => {
              //deshabilitar los botones segun el estado del contrato
              const deshabilitadoCalificar = c.status !== "Completado";
              const deshabilitadoArchivo =
                c.status === "Pendiente" ||
                c.status === "Cancelado" ||
                c.status === "Rechazado";
              const deshabilitadoAgendar = c.status !== "Aceptado";
              const deshabilitadoCancelar =
                c.status === "Completado" ||
                c.status === "Rechazado" ||
                c.status === "Cancelado";

              return (
                <tr key={c._id}>
                  <td>
                    {c.coachId
                      ? `${c.coachId.firstName} ${c.coachId.lastName}`
                      : "No disponible"}
                  </td>
                  <td>{c.serviceId?.name || "Servicio no disponible"}</td>
                  <td>{renderEstadoBadge(c.status)}</td>
                  <td>{c.serviceId?.duration || "N/A"} sesiones</td>

                  {/* Calificar */}
                  <td
                    className={
                      deshabilitadoCalificar ? "text-muted" : "text-primary"
                    }
                    style={{
                      cursor: deshabilitadoCalificar
                        ? "not-allowed"
                        : "pointer",
                    }}
                    onClick={() => {
                      if (!deshabilitadoCalificar) {
                        setContratoActivo(c);
                        setShowModalCalificar(true);
                      }
                    }}
                  >
                    <Star size={16} className="me-1" /> Calificar
                  </td>

                  {/* Archivos */}
                  <td
                    className={
                      deshabilitadoArchivo
                        ? "text-muted"
                        : "text-secondary fw-semibold"
                    }
                    style={{
                      cursor: deshabilitadoArchivo ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (!deshabilitadoArchivo) {
                        setContratoActivo(c);
                        setShowModalArchivos(true);
                      }
                    }}
                  >
                    <FileText size={16} className="me-1" /> Archivos
                  </td>

                  {/* Agendar */}
                  <td
                    className={
                      deshabilitadoAgendar
                        ? "text-muted"
                        : "text-secondary fw-semibold"
                    }
                    style={{
                      cursor: deshabilitadoAgendar ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (!deshabilitadoAgendar) {
                        setContratoActivo(c);
                        setShowModalAgendar(true);
                      }
                    }}
                  >
                    <Calendar size={16} className="me-1" /> Agendar
                  </td>

                  {/* Cancelar */}
                  <td
                    className={
                      deshabilitadoCancelar ? "text-muted" : "text-danger"
                    }
                    style={{
                      cursor: deshabilitadoCancelar ? "not-allowed" : "pointer",
                    }}
                    onClick={() => {
                      if (!deshabilitadoCancelar) {
                        if (
                          window.confirm(
                            "¿Estás seguro de que querés cancelar este contrato?"
                          )
                        ) {
                          handleCancelarContrato(c._id);
                        }
                      }
                    }}
                  >
                    <X size={16} className="me-1" /> Cancelar
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CalificacionModal
        show={showModalCalificar}
        onHide={() => setShowModalCalificar(false)}
        contrato={contratoActivo}
        onSubmit={handleEnviarCalificacion}
      />
      <ArchivosModal
        show={showModalArchivos}
        onHide={() => setShowModalArchivos(false)}
        contrato={contratoActivo}
      />
      <AgendarSesionModal
        show={showModalAgendar}
        onHide={() => setShowModalAgendar(false)}
        contrato={contratoActivo}
      />
    </div>
  );
}
