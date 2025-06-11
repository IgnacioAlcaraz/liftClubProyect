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
              // 🔒 Token JWT hardcodeado para entorno ngrok/sandbox
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODJjZDg1MjBmMjdkYTkyNDYzNmJlOWMiLCJyb2xlIjoiY2xpZW50IiwiaWF0IjoxNzQ5NTAxNTA2LCJleHAiOjE3NDk1ODc5MDZ9.WX_dCftHRDSaKgDwi8X-qdpz-wyXzmNDf9chHzKURRc",
            },
          }
        );

        setStatus("✅ Contrato creado correctamente");

        setTimeout(() => navigate("/client-home"), 2000);
      } catch (err) {
        console.error("❌ Error al crear contrato:", err);
        setStatus("Error al crear el contrato.");
      }
    };

    obtenerPreferenciaYCrearContrato();
  }, [navigate, token]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{status}</h2>
    </div>
  );
}
