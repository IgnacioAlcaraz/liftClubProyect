import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Componentes
import Header from "../components/client/Header/Header";
import ServicioDetalleCard from "../components/client/ServicioDetalle/ServicioDetalleCard";
import ReservaServicioCard from "../components/client/ServicioDetalle/ReservaServicioCard";

export default function ClientPageServicio1() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchServiceById = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Servicio con reviews:", response.data);
        setService(response.data);
      } catch (err) {
        console.error("Error al obtener el servicio:", err);
        setError("No se pudo cargar el servicio.");
      }
    };

    if (token) fetchServiceById();
    else setError("No hay token disponible.");
  }, [id, token]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!service) return <p className="text-center mt-5">Cargando servicio...</p>;

  return (
    <>
      <Header
        showSteps={true}
        currentStep={1}
        showSearch={false}
        showButtons={true}
      />

      <div className="container mt-4">
        <div className="row">
          {/* TARJETA DETALLE */}
          <div className="col-lg-8 mb-4">
            <ServicioDetalleCard servicio={service} />
          </div>

          {/* TARJETA RESERVA */}
          <div className="col-lg-4 mb-4">
            <ReservaServicioCard
              servicio={service}
              onReservar={() => alert("¡Reserva en progreso!")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
