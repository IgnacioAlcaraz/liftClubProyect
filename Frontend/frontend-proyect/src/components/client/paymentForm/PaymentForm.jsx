// components/PaymentForm.jsx
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SecondaryButton from "../../secondaryButton/SecondaryButton";

const PaymentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    fullName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pasás los datos al padre (ClientPagePago)
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">
              Numero de Tarjeta
            </label>
            <input
              type="text"
              className="form-control"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3910"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              className="form-control"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ignacio Martin Alcaraz"
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expiryDate" className="form-label">
                Fecha de Vencimiento
              </label>
              <input
                type="text"
                className="form-control"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="10/27"
              />
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="cvv" className="form-label">
                Código de Seguridad
              </label>
              <input
                type="text"
                className="form-control"
                id="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="289"
              />
            </div>
          </div>

          <div className="d-grid">
            <SecondaryButton texto="Realizar Pago" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
