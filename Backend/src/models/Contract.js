const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const contractSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coachId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pendiente", "Aceptado", "Rechazado", "Completado", "Cancelado"],
      default: "Pendiente",
    },

    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      method: {
        type: String,
        enum: ["Tarjeta", "MercadoPago"],
        required: true,
      },
      transactionId: {
        type: String,
        required: true,
      },
      cardLast4: {
        type: String,
        required: function () {
          return this.paymentDetails.method === "Tarjeta";
        },
      },
    },

    scheduledSessions: [
      {
        contractId: {
          type: Schema.Types.ObjectId,
          ref: "Contract",
        },
        date: {
          type: String,
          required: true,
        },

        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: [
            "Pendiente",
            "Aceptado",
            "Rechazado",
            "Completado",
            "Cancelado",
          ],
          default: "Pendiente",
        },
      },
    ],
    files: [fileSchema],
  },
  { timestamps: true }
);

const Contract = mongoose.model("Contract", contractSchema);
module.exports = Contract;
