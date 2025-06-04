import React, { useEffect, useState } from "react";
import HeaderCoach from "../components/coach/headerCoach/headerCoach";
import AcceptedContractsTable from "../components/coach/acceptedContractsTable/AcceptedContractsTable";
import SessionsTable from "../components/client/SessionsTable/SessionsTable";
import ArchivosModal from "../components/client/ArchivosModal/ArchivosModal";
import { useSelector } from "react-redux";

import axios from "axios";

const CoachServices = () => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");
  const [sessions, setSessions] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [showModalFileUpload, setShowModalFileUpload] = useState(false);
  const [activeContract, setActiveContract] = useState(null);

  const getContracts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contracts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setContracts(response.data);
    } catch (error) {
      console.error(
        "Error al obtener contratos:",
        error.response?.data || error.message
      );
    }
  };

  const getSessions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/contracts/user/scheduledSessions",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      setSessions(response.data);
    } catch (error) {
      console.error(
        "Error al obtener sesiones:",
        error.response?.data || error.message
      );
    }
  };

  const handleCancelContract = async (contractId) => {
    const confirmation = window.confirm(
      "¿Estás seguro que deseas cancelar este contrato?"
    );
    if (!confirmation) return;
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/contracts/${contractId}`,
        { status: "Cancelado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getContracts();
    } catch (error) {
      console.error("Error al cancelar contrato:", error);
    }
  };

  useEffect(() => {
    getSessions();
    getContracts();
  }, []);

  return (
    <>
      <HeaderCoach />

      <div className="container mt-4">
        <h1 className="text-center mb-4">Servicios Aceptados</h1>

        <div className="table-responsive">
          <AcceptedContractsTable
            contracts={contracts}
            setActiveContract={setActiveContract}
            onShowModalFileUpload={() => setShowModalFileUpload(true)}
            onCancelContract={handleCancelContract}
          />
        </div>

        <div className="container mt-4">
          <h2 className="text-center mb-4">Citas Agendadas</h2>
          <SessionsTable
            misSesiones={sessions}
            onMarcarComoCompletada={() => {}}
            isCoach={true}
          />
        </div>
      </div>

      <ArchivosModal
        show={showModalFileUpload}
        onHide={() => setShowModalFileUpload(false)}
        contrato={activeContract}
        isCoach={true}
      />
    </>
  );
};

export default CoachServices;
