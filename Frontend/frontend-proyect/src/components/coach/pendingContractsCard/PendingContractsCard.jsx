import React from "react";
import { Check, X } from "lucide-react";
import "./PendingContractsCard.css";
import axios from "axios";
import { useSelector } from "react-redux";

const PendingContractsCard = ({ contract, onContractsUpdate }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const handleAccept = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/contracts/${contract._id}`,
        {
          status: "Aceptado",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onContractsUpdate();
    } catch (error) {
      console.error("Error al aceptar el contrato:", error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/contracts/${contract._id}`,
        {
          status: "Rechazado",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onContractsUpdate();
    } catch (error) {
      console.error("Error al rechazar el contrato:", error);
    }
  };

  return (
    <div className="pending-contracts-card">
      <div className="contract-info">
        <h3 className="contract-name">
          {contract.serviceId
            ? contract.serviceId.name
            : "Servicio no disponible"}
        </h3>
        <p className="contract-client">
          Cliente:{" "}
          {contract.clientId
            ? `${contract.clientId.firstName} ${contract.clientId.lastName}`
            : "Cliente no disponible"}
        </p>
      </div>

      <div className="contract-actions">
        <button className="accept-button" onClick={handleAccept}>
          <Check color="#4529E6" size={20} />
        </button>
        <button className="reject-button" onClick={handleReject}>
          <X color="#4529E6" size={20} />
        </button>
      </div>
    </div>
  );
};

export default PendingContractsCard;
