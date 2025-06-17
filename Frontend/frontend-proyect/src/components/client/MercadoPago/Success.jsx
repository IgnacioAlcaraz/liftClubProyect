import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Success() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [status, setStatus] = useState("Procesando pago...");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const paymentId = query.get("payment_id");

    if (!paymentId) {
      setStatus("Falta el payment_id");
      return;
    }

    const obtenerPreferenciaYCrearContrato = async () => {
      try {
        // Obtener los datos del pago desde la API de MercadoPago
        const response = await axios.get(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_MP_ACCESS_TOKEN}`,
            },
          }
        );

        console.log(" Respuesta completa de MercadoPago:", response.data);
        console.log("📦 Metadata recibida:", response.data.metadata);

        const metadata = response.data.metadata;
        const serviceId = metadata?.service_id;
        const price = metadata?.price;
        const token = metadata?.token;
        localStorage.setItem("token", token);

        if (!serviceId || !price) {
          setStatus("No se encontraron los datos necesarios en metadata.");
          return;
        }

        // Crear contrato en tu backend
        await axios.post(
          "http://localhost:5000/api/contracts",
          {
            serviceId,
            price: Number(price),
            paymentDetails: {
              method: "MercadoPago",
              transactionId: paymentId,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStatus("Contrato creado correctamente");

        setTimeout(() => navigate("/client-home"), 2000);
      } catch (err) {
        console.error("Error al crear contrato:", err);
        setStatus("Error al crear el contrato.");
      }
    };

    obtenerPreferenciaYCrearContrato();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{status}</h2>
    </div>
  );
}
