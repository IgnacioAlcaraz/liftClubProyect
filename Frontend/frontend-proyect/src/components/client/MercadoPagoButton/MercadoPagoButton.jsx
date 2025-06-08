// MercadoPagoButton.jsx
import { Wallet } from "@mercadopago/sdk-react";

export default function MercadoPagoButton({ preferenceId, onPagoExitoso }) {
  return (
    <div>
      <Wallet
        initialization={{
          preferenceId: preferenceId,
          redirectMode: "modal", // o 'self' si quieres redirección completa
        }}
        customization={{
          texts: {
            valueProp: "smart_option",
          },
        }}
        onReady={() => console.log("MercadoPago Wallet listo")}
        onError={(error) => console.error("Error en MercadoPago:", error)}
        onSubmit={(data) => {
          console.log("Pago enviado:", data);
          if (onPagoExitoso) onPagoExitoso(data);
        }}
      />
    </div>
  );
}
