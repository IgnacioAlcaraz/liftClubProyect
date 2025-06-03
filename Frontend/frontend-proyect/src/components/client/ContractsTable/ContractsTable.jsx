import React from "react";
import { Star, FileText, Calendar, X } from "lucide-react";
export default function ContractsTable({
  misContratos,
  setContratoActivo,
  onAbrirModalCalificar,
  onAbrirModalArchivo,
  onAbrirModalAgendar,
  onCancelarContrato,
}) {
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
                  cursor: deshabilitadoCalificar ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (!deshabilitadoCalificar) {
                    setContratoActivo(c);
                    onAbrirModalCalificar();
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
                    onAbrirModalArchivo();
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
                    onAbrirModalAgendar();
                  }
                }}
              >
                <Calendar size={16} className="me-1" /> Agendar
              </td>

              {/* Cancelar */}
              <td
                className={deshabilitadoCancelar ? "text-muted" : "text-danger"}
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
                      onCancelarContrato(c._id);
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
  );
}
