import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { BarChart } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Bell } from "lucide-react";
import axios from "axios";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import LogoutButton from "../../logoutButton/LogoutButton";
import logo from "../../../assets/logo.png";
import "./headerCoach.css";
import PendingContractsModal from "../pendingContractsModal/PendingContractsModal";

const Header = () => {
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
    <div className="custom-header">
      <div className="left">
        <div className="logo-container">
          <img src={logo} alt="LiftClub" className="logo" />
        </div>
      </div>

      {
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
            <Bell />
            {pendingContracts.length > 0 && (
              <span className="notification-badge">
                {pendingContracts.length}
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
      }
    </div>
  );
};

export default Header;
