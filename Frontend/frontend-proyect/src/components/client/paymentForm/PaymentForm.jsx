import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import SecondaryButton from "../../secondaryButton/SecondaryButton";

const PaymentForm = ({ onSubmit, service }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    fullName: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validación número de tarjeta (16 dígitos con o sin espacios)
    const cardNumberClean = formData.cardNumber.replace(/\s/g, "");
    if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber =
        "Número de tarjeta inválido (deben ser 16 dígitos)";
    }

    // Validación nombre completo (no vacío y solo letras + espacios)
    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Nombre inválido (solo letras y espacios)";
    }

    // Validación fecha de vencimiento (MM/YY con mes válido)
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Formato inválido (debe ser MM/AA)";
    }

    // Validación CVV (3 o 4 dígitos)
    if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV inválido (3 o 4 dígitos)";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Si pasa la validación, enviar los datos
    onSubmit(formData);
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%", overflow: "visible" }}
      >
        <form onSubmit={handleFormSubmit}>
          <div className="mb-3">
            <label htmlFor="cardNumber" className="form-label">
              Número de Tarjeta
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.cardNumber ? "is-invalid" : ""
              }`}
              id="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
            />
            {errors.cardNumber && (
              <div className="invalid-feedback">{errors.cardNumber}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Nombre Completo
            </label>
            <input
              type="text"
              className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ignacio Martin Alcaraz"
            />
            {errors.fullName && (
              <div className="invalid-feedback">{errors.fullName}</div>
            )}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="expiryDate" className="form-label">
                Fecha de Vencimiento
              </label>
              <input
                type="text"
                className={`form-control ${
                  errors.expiryDate ? "is-invalid" : ""
                }`}
                id="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="10/27"
              />
              {errors.expiryDate && (
                <div className="invalid-feedback">{errors.expiryDate}</div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="cvv" className="form-label">
                Código de Seguridad
              </label>
              <input
                type="text"
                className={`form-control ${errors.cvv ? "is-invalid" : ""}`}
                id="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="289"
              />
              {errors.cvv && (
                <div className="invalid-feedback">{errors.cvv}</div>
              )}
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
