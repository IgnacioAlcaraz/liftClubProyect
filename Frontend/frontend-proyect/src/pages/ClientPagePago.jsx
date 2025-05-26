import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/client/Header/Header";
import PaymentForm from "../components/client/paymentForm/PaymentForm";

export default function ClientPagePago() {
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

        console.log("Servicio:", response.data);
        setService(response.data);
      } catch (err) {
        console.error("Error al obtener el servicio:", err);
        setError("No se pudo cargar el servicio.");
      }
    };

    if (token) fetchServiceById();
    else setError("No hay token disponible.");
  }, [id, token]);
  return (
    <>
      <Header
        showSteps={true}
        currentStep={2}
        showSearch={false}
        showButtons={true}
      />
      <PaymentForm></PaymentForm>
    </>
  );
}
