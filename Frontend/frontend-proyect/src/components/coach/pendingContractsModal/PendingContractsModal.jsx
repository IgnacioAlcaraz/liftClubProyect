import React from "react";
import PendingContractsCard from "../pendingContractsCard/PendingContractsCard";
import BaseModal from "../../baseModal/BaseModal";
import { Button } from "react-bootstrap";

const PendingContractsModal = ({
  isOpen,
  onClose,
  contracts,
  onContractsUpdate,
}) => {
  return (
    <BaseModal
      show={isOpen}
      onClose={onClose}
      title="Solicitudes Pendientes"
      footer={
        <Button className="btn btn-secondary w-100" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      {contracts.length === 0 ? (
        <p className="text-center">No hay solicitudes pendientes</p>
      ) : (
        <div className="pending-contracts-list">
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
      )}
    </BaseModal>
  );
};

export default PendingContractsModal;
