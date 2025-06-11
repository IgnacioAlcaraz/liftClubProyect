import { Wallet } from "@mercadopago/sdk-react";

export default function MercadoPagoButton({ preferenceId }) {
  return (
    <div>
      <Wallet
        initialization={{
          preferenceId: preferenceId,
          redirectMode: "self", 
        }}
        customization={{
          texts: {
            valueProp: "smart_option",
          },
        }}
        onReady={() => console.log("MercadoPago Wallet listo")}
        onError={(error) => console.error("Error en MercadoPago:", error)}
      />
    </div>
  );
}
