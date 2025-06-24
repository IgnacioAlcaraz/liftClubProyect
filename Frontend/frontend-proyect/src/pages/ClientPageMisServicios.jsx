import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FileText, Calendar, X } from "lucide-react"; // Íconos de lucide-react
import CalificacionModal from "../components/client/CalificacionModal/CalificacionModal";
import ArchivosModal from "../components/client/ArchivosModal/ArchivosModal";
import AgendarSesionModal from "../components/client/AgendarSesionModal/AgendarSesionModal";
import HeaderClient from "../components/client/headerClient/HeaderClient";
import ContractsTable from "../components/client/ContractsTable/ContractsTable";
import SessionsTable from "../components/client/SessionsTable/SessionsTable";

export default function ClientPageMisServicios() {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const [misContratos, setMisContratos] = useState([]);
  const [misSesiones, setMisSesiones] = useState([]);

  const [error, setError] = useState(null);

  //estados para trabajar con los modal
  const [contratoActivo, setContratoActivo] = useState(null);

  const [showModalCalificar, setShowModalCalificar] = useState(false);

  const [showModalArchivos, setShowModalArchivos] = useState(false);

  const [showModalAgendar, setShowModalAgendar] = useState(false);

  const fetchMisSesiones = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/contracts/user/scheduledSessions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMisSesiones(response.data);
    } catch (error) {
      console.error("Error al cargar sesiones:", error);
      setError("No se pudieron cargar los contratos.");
    }
  };

  const fetchMisContratos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contracts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMisContratos(response.data);
    } catch (error) {
      console.error("Error al cargar contratos:", error);
      setError("No se pudieron cargar los contratos.");
    }
  };
  useEffect(() => {
    if (token) fetchMisContratos();
  }, [token]);

  useEffect(() => {
    if (token) fetchMisSesiones();
  }, [token]);

  //funcion para cambiar estado de una sesion
  const handleMarcarComoCompletada = async (sessionId) => {
    try {
      const sesion = misSesiones.find((s) => s._id === sessionId);
      if (!sesion || !sesion.contractId) {
        alert("No se encontró la sesión o el contrato asociado.");
        return;
      }

      const contractId = sesion.contractId;

      await axios.patch(
        `http://localhost:5000/api/contracts/${contractId}/scheduledSessions/${sessionId}`,
        { status: "Completado" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar en el frontend
      setMisSesiones((prev) =>
        prev.map((s) =>
          s._id === sessionId ? { ...s, status: "Completado" } : s
        )
      );

      await fetchMisContratos(); //  sincroniza estado actualizado
    } catch (error) {
      console.error("Error al marcar como completada:", error);
      alert(
        error.response?.data?.message ||
          "Error al actualizar el estado de la sesión."
      );
    }
  };

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

      await fetchMisContratos(); //  actualiza el estado del contrato
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

  return (
    <>
      <HeaderClient
        showSearch={false}
        showButtons={true}
        showMisServiciosButton={false}
      />

      <div className="container mt-4">
        <h2 className="text-center mb-4">Mis Servicios</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="table-responsive">
          <ContractsTable
            misContratos={misContratos}
            setContratoActivo={setContratoActivo}
            onAbrirModalCalificar={() => setShowModalCalificar(true)}
            onAbrirModalArchivo={() => setShowModalArchivos(true)}
            onAbrirModalAgendar={() => setShowModalAgendar(true)}
            onCancelarContrato={handleCancelarContrato}
          ></ContractsTable>
        </div>

        {/* Tabla de schedulledsessions */}

        <div className="container mt-4">
          <h2 className="text-center mb-4">Mis Sesiones</h2>
          <SessionsTable
            misSesiones={misSesiones}
            onMarcarComoCompletada={handleMarcarComoCompletada}
            isCoach={false}
          ></SessionsTable>
          <div className="table-responsive"></div>
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
          isCoach={false}
        />
        <AgendarSesionModal
          show={showModalAgendar}
          onHide={() => setShowModalAgendar(false)}
          contrato={contratoActivo}
          onAgendar={fetchMisSesiones}
        />
      </div>
    </>
  );
}
