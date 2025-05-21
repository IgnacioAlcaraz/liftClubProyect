import React from "react";
import "./StepsBar.css";

const steps = ["Detalles de servicio", "Detalles de pago", "Confirmar pago"];

const StepsBar = ({ currentStep }) => {
  return (
    <div className="steps-bar">
      {steps.map((label, idx) => (
        <div key={idx} className="step">
          <div className={`circle ${idx === currentStep ? "active" : ""}`} />
          <div className="label">{label}</div>
        </div>
      ))}
    </div>
  );
};

export default StepsBar;
