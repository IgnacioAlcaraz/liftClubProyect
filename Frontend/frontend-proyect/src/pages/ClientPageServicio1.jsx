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
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No hay token disponible.");
        return;
      }

      try {
        // Obtener servicio
        const serviceResponse = await axios.get(
          `http://localhost:5000/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setService(serviceResponse.data);

        // Obtener reviews del servicio
        const reviewsResponse = await axios.get(
          `http://localhost:5000/api/reviews/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReviews(reviewsResponse.data.reviews || []);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("No se pudo cargar la información.");
      }
    };

    fetchData();
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
            <ServicioDetalleCard servicio={service} reviews={reviews} />
          </div>

          <div className="col-lg-6 col-md-12 d-flex">
            <ReservaServicioCard servicio={service} />
          </div>
        </div>
      </div>
    </>
  );
}
