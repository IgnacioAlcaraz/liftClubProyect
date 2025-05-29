import React from "react";
import { CheckCircle } from "lucide-react";
import SecondaryButton from "../../secondaryButton/SecondaryButton";
import "./PagoExitosoFinal.css";

export default function PagoExitosoFinal({ onContinue }) {
  return (
    <div className="pago-exitoso-wrapper">
      <div className="pago-exitoso-card shadow">
        <div className="icono-check">
          <CheckCircle size={32} />
        </div>

        <h4 className="titulo-exito">¡Felicidades!</h4>

        <div className="mensaje-exito">
          <strong>Tu pago se ha realizado con éxito.</strong>
          <br />
          <span>Podés continuar para ver tus servicios.</span>
        </div>

        <SecondaryButton
          texto="Continuar"
          onClick={onContinue}
          className="btn-continuar"
        />
      </div>
    </div>
  );
}
