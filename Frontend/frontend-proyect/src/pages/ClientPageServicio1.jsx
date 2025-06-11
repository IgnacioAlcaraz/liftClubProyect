import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../App.css";
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
        <div className="row align-items-stretch g-3">
          <div className="col-lg-6 col-md-12 d-flex">
            <ServicioDetalleCard servicio={service} />
          </div>

          <div className="col-lg-6 col-md-12 d-flex">
            <ReservaServicioCard servicio={service} />
          </div>
        </div>
      </div>
    </>
  );
}
