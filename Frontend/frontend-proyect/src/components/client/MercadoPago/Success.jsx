import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../app/slices/authSlice";
import axios from "axios";

export default function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const originalToken = localStorage.getItem("token");
  const originalUser = JSON.parse(localStorage.getItem("user") || "null");
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
        // obtener los datos del pago desde la API de MercadoPago
        const response = await axios.get(
          `https://api.mercadopago.com/v1/payments/${paymentId}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_MP_ACCESS_TOKEN}`,
            },
          }
        );

        console.log(" Respuesta completa de MercadoPago:", response.data);
        console.log(" Metadata recibida:", response.data.metadata);

        const metadata = response.data.metadata;
        const serviceId = metadata?.service_id;
        const price = metadata?.price;

        if (!serviceId || !price) {
          setStatus("No se encontraron los datos necesarios en metadata.");
          return;
        }

        // crear contrato
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
              Authorization: `Bearer ${originalToken}`,
            },
          }
        );

        setStatus("Contrato creado correctamente");

        if (originalToken && originalUser) {
          dispatch(loginSuccess({ token: originalToken, user: originalUser }));
        }

        setTimeout(() => navigate("/client-home"), 2000);
      } catch (err) {
        console.error("Error al crear contrato:", err);
        setStatus("Error al crear el contrato.");
      }
    };

    obtenerPreferenciaYCrearContrato();
  }, [originalToken, originalUser, dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{status}</h2>
    </div>
  );
}
