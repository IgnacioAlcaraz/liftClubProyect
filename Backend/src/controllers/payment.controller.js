const { MercadoPagoConfig, Preference } = require("mercadopago");
require("dotenv").config();

const client = new MercadoPagoConfig({
  accessToken: process.env.TU_ACCESS_TOKEN_SANDBOX,
  options: {
    timeout: 5000,
    integratorId: "dev_24c65fb163bf11ea96500242ac130004",
  },
});

const preference = new Preference(client);

const createPreference = async (req, res) => {
  try {
    const { serviceId, price, title } = req.body;

    if (!price || isNaN(price)) {
      return res.status(400).json({
        error: "El precio es requerido y debe ser un número válido",
      });
    }

    const preferenceData = {
      items: [
        {
          title: title || "Servicio",
          quantity: 1,
          unit_price: Number(price),
          currency_id: "ARS",
        },
      ],
      back_urls: {
        success:
          "https://5353-2800-21e1-4000-8c7-e996-11c8-4c31-73df.ngrok-free.app/payment/success",
        failure: "https://www.ejemplo.com/failure",
        pending: "https://www.ejemplo.com/pending",
      },
      auto_return: "approved",
      metadata: {
        serviceId,
        price,
      },
    };

    console.log(
      "Enviando preferencia a MercadoPago:",
      JSON.stringify(preferenceData, null, 2)
    );

    const response = await preference.create({ body: preferenceData });

    return res.status(200).json({
      preferenceId: response.id,
    });
  } catch (error) {
    console.error("Error:", JSON.stringify(error, null, 2));
    res.status(500).json({ error: "Error al crear la preferencia" });
  }
};

module.exports = { createPreference };
