import React from "react";
import { Star, FileText, Calendar, X } from "lucide-react";
import "./contractsTable.css";

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

  const renderActionButton = (
    icon,
    text,
    isDisabled,
    onClick,
    colorClass = "text-secondary"
  ) => (
    <div
      className={`action-button fs-6 ${isDisabled ? "text-muted" : colorClass}`}
      style={{
        cursor: isDisabled ? "not-allowed" : "pointer",
      }}
      onClick={() => {
        if (!isDisabled) {
          onClick();
        }
      }}
    >
      {icon} <span>{text}</span>
    </div>
  );

  return (
    <div className="contracts-table-container">
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
            const deshabilitadoCalificar =
              c.status !== "Completado" || c.reviewSubmitted;
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
                <td>
                  {renderActionButton(
                    <Star size={16} className="me-1" />,
                    "Calificar",
                    deshabilitadoCalificar,
                    () => {
                      setContratoActivo(c);
                      onAbrirModalCalificar();
                    },
                    "text-warning"
                  )}
                </td>
                <td>
                  {renderActionButton(
                    <FileText size={16} className="me-1" />,
                    "Archivos",
                    deshabilitadoArchivo,
                    () => {
                      setContratoActivo(c);
                      onAbrirModalArchivo();
                    },
                    "text-primary"
                  )}
                </td>
                <td>
                  {renderActionButton(
                    <Calendar size={16} className="me-1" />,
                    "Agendar",
                    deshabilitadoAgendar,
                    () => {
                      setContratoActivo(c);
                      onAbrirModalAgendar();
                    },
                    "text-success"
                  )}
                </td>
                <td>
                  {renderActionButton(
                    <X size={16} className="me-1" />,
                    "Cancelar",
                    deshabilitadoCancelar,
                    () => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que querés cancelar este contrato?"
                        )
                      ) {
                        onCancelarContrato(c._id);
                      }
                    },
                    "text-danger"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
