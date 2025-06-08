// payment.controller.js
const { MercadoPagoConfig, Preference } = require("mercadopago");
require("dotenv").config();

// Configurar el cliente con el access token (sandbox)
const client = new MercadoPagoConfig({
  accessToken: process.env.TU_ACCESS_TOKEN_SANDBOX,
  options: {
    timeout: 5000,
    // Importante: asegúrate de que esté en modo sandbox
    integratorId: "dev_24c65fb163bf11ea96500242ac130004", // opcional
  },
});

console.log("⚠️ Token usado:", process.env.TU_ACCESS_TOKEN_SANDBOX);

// Crear instancia de Preference
const preference = new Preference(client);

const createPreference = async (req, res) => {
  try {
    const { serviceId, price, title } = req.body;

    // Validar datos de entrada
    if (!price || isNaN(price)) {
      return res.status(400).json({
        error: "El precio es requerido y debe ser un número válido",
      });
    }

    // Validar que el access token esté configurado y sea de TEST
    if (!process.env.TU_ACCESS_TOKEN_SANDBOX) {
      console.error("Access token no configurado");
      return res.status(500).json({
        error: "Configuración de MercadoPago incompleta",
      });
    }

    // Verificar que el token sea de sandbox
    if (!process.env.TU_ACCESS_TOKEN_SANDBOX.startsWith("TEST-")) {
      console.error("Access token no es de sandbox");
      return res.status(500).json({
        error: "Debe usar credenciales de sandbox (TEST-)",
      });
    }

    console.log("Creando preferencia con:", { serviceId, price, title });

    const preferenceData = {
      items: [
        {
          title: title || "Servicio",
          unit_price: parseFloat(price),
          quantity: 1,
          // Agregar estos campos ayuda
          currency_id: "ARS", // o la moneda que uses
          category_id: "services", // categoría del producto
        },
      ],
      // URLs de tu dominio (reemplaza con tus URLs reales)
      back_urls: {
        success: "http://localhost:5173/payment/success",
        failure: "http://localhost:5173/payment/failure",
        pending: "http://localhost:5173/payment/pending",
      },
      // auto_return: "approved",
      // Configuración importante para sandbox
      purpose: "wallet_purchase",
      metadata: {
        service_id: serviceId,
      },
    };

    const response = await preference.create({ body: preferenceData });

    console.log("Preferencia creada exitosamente:", response.id);
    console.log("Init point:", response.init_point);
    console.log("Sandbox init point:", response.sandbox_init_point);
    console.log(
      "Access token usado:",
      process.env.TU_ACCESS_TOKEN_SANDBOX?.substring(0, 10) + "..."
    );

    res.json({
      preferenceId: response.id,
      // IMPORTANTE: En sandbox usa sandbox_init_point
      initPoint: response.sandbox_init_point || response.init_point,
      sandboxInitPoint: response.sandbox_init_point,
    });
  } catch (error) {
    console.error("Error completo creando preferencia:", error);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response?.data);

    res.status(500).json({
      error: "Error creando preferencia",
      details: error.message,
      mercadoPagoError: error.response?.data,
    });
  }
};

module.exports = {
  createPreference,
};
