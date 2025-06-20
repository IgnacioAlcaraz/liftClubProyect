import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart, CheckCircle, Bell } from "lucide-react";
import axios from "axios";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import LogoutButton from "../../logoutButton/LogoutButton";
import "../../header/header.css";
import PendingContractsModal from "../pendingContractsModal/PendingContractsModal";
import Header from "../../header/Header";

const HeaderCoach = () => {
  const [isPendingContractsModalOpen, setIsPendingContractsModalOpen] =
    useState(false);
  const [pendingContracts, setPendingContracts] = useState([]);
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const getPendingContracts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/contracts/pending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPendingContracts(response.data);
    } catch (error) {
      console.error("Error al obtener contratos pendientes:", error);
      setPendingContracts([]);
    }
  };

  useEffect(() => {
    getPendingContracts();
  }, []);

  return (
    <Header onLogoClick="/coach-home">
      <div className="right">
        <PrimaryButton
          icon={BarChart}
          text="Estadísticas"
          to="/stats"
          variant="primary"
        />

        <PrimaryButton
          icon={CheckCircle}
          text="Servicios Aceptados"
          to="/coach-services"
          variant="primary"
        />

        <button
          className="notification-button"
          onClick={() => setIsPendingContractsModalOpen(true)}
        >
          <Bell size={18} />
          {pendingContracts.length > 0 && pendingContracts.length !== 1 && (
            <span className="notification-badge">
              {pendingContracts.length}
              {pendingContracts.length > 1
                ? " Notificaciones"
                : " Notificacion"}
            </span>
          )}
        </button>

        <LogoutButton />

        <PendingContractsModal
          isOpen={isPendingContractsModalOpen}
          onClose={() => setIsPendingContractsModalOpen(false)}
          contracts={pendingContracts}
          onContractsUpdate={getPendingContracts}
        />
      </div>
    </Header>
  );
};

export default HeaderCoach;
