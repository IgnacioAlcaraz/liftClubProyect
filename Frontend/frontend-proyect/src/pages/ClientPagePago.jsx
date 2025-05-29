import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
import Header from "../components/client/Header/Header";
import PaymentForm from "../components/client/paymentForm/PaymentForm";
import ConfirmacionPago from "../components/client/ConfirmacionPago/ConfirmacionPago";
import PagoExitosoFinal from "../components/client/PagoExitosoFinal/PagoExitosoFinal";
export default function ClientPagePago() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const [stepDePago, setStepDePago] = useState(1); //controlar la 'pantalla' de pasos de pago
  const [tempFormData, setTempFormData] = useState(null);

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
        currentStep={stepDePago + 1}
        showSearch={false}
        showButtons={true}
      />

      {stepDePago === 1 && (
        <PaymentForm
          onSubmit={(formData) => {
            setTempFormData(formData); // Guardamos datos temporales
            setStepDePago(2); // Avanzamos a confirmación
          }}
        />
      )}

      {stepDePago === 2 && (
        <ConfirmacionPago
          onConfirm={async () => {
            await handleCrearContratoConTarjeta(tempFormData);
            setStepDePago(3);
          }}
          onCancel={() => setStepDePago(1)}
        />
      )}

      {stepDePago === 3 && (
        <PagoExitosoFinal onContinue={() => navigate("/client-home")} />
      )}
    </>
  );
}
