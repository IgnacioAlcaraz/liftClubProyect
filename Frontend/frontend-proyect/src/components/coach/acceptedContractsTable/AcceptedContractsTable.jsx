import React from "react";
import { X, Paperclip } from "lucide-react";
import "./acceptedContractsTable.css";

const AcceptedContractsTable = ({
  contracts,
  onShowModalFileUpload,
  onCancelContract,
  setActiveContract,
}) => {
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
    <div className="table-container">
      <table className="table table-bordered table-hover align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>Cliente</th>
            <th>Servicio</th>
            <th>Estado</th>
            <th>Archivos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((contract) => {
            const disableFileUpload =
              contract.status === "Completado" ||
              contract.status === "Cancelado" ||
              contract.status === "Rechazado";

            const disableCancel =
              contract.status === "Completado" ||
              contract.status === "Rechazado" ||
              contract.status === "Cancelado";

            return (
              <tr key={contract._id}>
                <td>
                  {contract.clientId.firstName} {contract.clientId.lastName}
                </td>
                <td>{contract.serviceId.name}</td>
                <td>{renderEstadoBadge(contract.status)}</td>
                <td
                  className={disableFileUpload ? "text-muted" : "text-primary"}
                  onClick={() => {
                    if (!disableFileUpload) {
                      setActiveContract(contract);
                      onShowModalFileUpload(contract._id);
                    }
                  }}
                  style={{
                    cursor: disableFileUpload ? "not-allowed" : "pointer",
                  }}
                >
                  <Paperclip size={16} className="me-1" /> Subir archivos
                </td>
                <td
                  className={disableCancel ? "text-muted" : "text-danger"}
                  onClick={() => {
                    if (!disableCancel) {
                      onCancelContract(contract._id);
                    }
                  }}
                  style={{
                    cursor: disableCancel ? "not-allowed" : "pointer",
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
  );
};

export default AcceptedContractsTable;
