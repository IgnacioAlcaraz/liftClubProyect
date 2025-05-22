import React from "react";
import { Check } from "lucide-react";
import "./StepsBar.css";

const steps = ["Detalles de servicio", "Detalles de pago", "Confirmar pago"];

const StepsBar = ({ step }) => {
  return (
    <div className="steps-bar">
      {steps.map((label, index) => {
        const stepNumber = index + 1;

        let content;
        let className = "step";

        //logica para avanzar en los pasos
        if (step > stepNumber) {
          content = <Check size={16} color="white" />;
          className += " completed";
        } else {
          content = <div className="dot active" />;
          className += " active";
        }

        return (
          <div className={className} key={stepNumber}>
            <div className="circle">{content}</div>
            <span className="label">{label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default StepsBar;
