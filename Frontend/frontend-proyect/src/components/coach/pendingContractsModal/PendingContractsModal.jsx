import React from "react";
import { X } from "lucide-react";
import PendingContractsCard from "../pendingContractsCard/PendingContractsCard";
import "./PendingContractsModal.css";

const PendingContractsModal = ({
  isOpen,
  onClose,
  contracts,
  onContractsUpdate,
}) => {
  if (!isOpen) return null;

  console.log(contracts);
  return (
    <div className="modal-overlay">
      <div className="pending-contracts-modal">
        <div className="modal-header">
          <h2>Solicitudes Pendientes</h2>
          <button className="close-button" onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="modal-content">
          {contracts.length === 0 && <p>No hay solicitudes pendientes</p>}
          {contracts
            .filter((contract) => contract.serviceId && contract.clientId)
            .map((contract) => (
              <PendingContractsCard
                key={contract._id}
                contract={contract}
                onContractsUpdate={onContractsUpdate}
              />
            ))}
        </div>
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingContractsModal;
