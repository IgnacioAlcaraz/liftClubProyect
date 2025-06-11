import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/client/Header/Header";
import PaymentForm from "../components/client/paymentForm/PaymentForm";
import ConfirmacionPago from "../components/client/ConfirmacionPago/ConfirmacionPago";
import PagoExitosoFinal from "../components/client/PagoExitosoFinal/PagoExitosoFinal";
import MercadoPagoButton from "../components/client/MercadoPagoButton/MercadoPagoButton";

export default function ClientPagePago() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [stepDePago, setStepDePago] = useState(1);
  const [tempFormData, setTempFormData] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);

  // Crear contrato simulado con tarjeta
  const handleCrearContratoConTarjeta = async (formData) => {
    const last4 = formData.cardNumber.slice(-4);
    const fakeTransactionId =
      "fake_txn_" + Math.random().toString(36).substring(2, 12);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contracts",
        {
          serviceId: service._id,
          price: service.price,
          paymentDetails: {
            method: "Tarjeta",
            cardLast4: last4,
            transactionId: fakeTransactionId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Contrato creado:", response.data);
    } catch (error) {
      console.error("Error al crear contrato:", error);
    }
  };

  // Crear preferencia y preparar redirección con MercadoPago
  const handleMercadoPago = async () => {
    if (!service || !service._id || !service.price) {
      console.error("El servicio aún no fue cargado completamente.");
      return;
    }

    try {
      // Guardar datos reales
      localStorage.setItem("servicio_pago_actual", service._id);
      localStorage.setItem("precio_pago_actual", service.price);

      const res = await axios.post(
        "http://localhost:5000/api/payments/create_preference",
        {
          serviceId: service._id,
          price: service.price,
          title: service.title || "Servicio",
          token: token,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPreferenceId(res.data.preferenceId);
    } catch (error) {
      console.error(
        "Error al crear preferencia",
        error.response?.data || error.message
      );
    }
  };

  // Obtener servicio desde backend
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
        currentStep={stepDePago + 1}
        showSearch={false}
        showButtons={true}
      />

      {/* STEP 1: Formulario de pago */}
      {stepDePago === 1 && (
        <>
          <PaymentForm
            onSubmit={(formData) => {
              setTempFormData(formData);
              setStepDePago(2);
            }}
          />

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <p>O</p>
            {!preferenceId ? (
              <button onClick={handleMercadoPago} className="btn btn-success">
                Pagar con MercadoPago
              </button>
            ) : (
              <div style={{ marginTop: "20px" }}>
                <MercadoPagoButton preferenceId={preferenceId} />
              </div>
            )}
          </div>
        </>
      )}

      {/* STEP 2: Confirmar tarjeta */}
      {stepDePago === 2 && (
        <ConfirmacionPago
          onConfirm={async () => {
            await handleCrearContratoConTarjeta(tempFormData);
            setStepDePago(3);
          }}
          onCancel={() => setStepDePago(1)}
        />
      )}

      {/* STEP 3: Pago exitoso local */}
      {stepDePago === 3 && (
        <PagoExitosoFinal onContinue={() => navigate("/client-home")} />
      )}
    </>
  );
}
