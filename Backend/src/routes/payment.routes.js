const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");

// POST para crear preferencia de pago MercadoPago
router.post("/create_preference", paymentController.createPreference);

module.exports = router;
