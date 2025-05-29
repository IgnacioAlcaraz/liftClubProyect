import React from "react";
import { AlertCircle, HelpCircle } from "lucide-react";
import SecondaryButton from "../../secondaryButton/SecondaryButton"; 
import "./ConfirmacionPago.css";

export default function ConfirmacionPago({ onConfirm, onCancel }) {
  return (
    <div className="confirmacion-pago-wrapper">
      <div className="confirmacion-pago-card shadow">
        <div className="icono-pregunta">
          <HelpCircle size={32} />
        </div>

        <h4 className="titulo-confirmacion">Confirmar Pago</h4>

        <div className="recuadro-aviso">
          <div className="titulo-aviso">
            <AlertCircle size={20} />
            <strong>Importante</strong>
          </div>
          <p className="mensaje-aviso">
            Al hacer clic en <strong>"Confirmar"</strong> marcaremos tu venta como
            pagada.
          </p>
        </div>

        <div className="botones-confirmacion-row">
          <SecondaryButton
            texto="Confirmar"
            onClick={onConfirm}
            className="btn-confirmar"
          />
          <button
            className="btn btn-outline-secondary btn-cancelar"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
