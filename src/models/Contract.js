const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
      enum: ["Pendiente", "Aceptado", "Rechazado", "Completado"],
      default: "Pendiente",
    },
    reviewSubmitted: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      cardLast4: {
        type: String,
        required: true,
      },
      transactionId: {
        type: String,
        required: true,
      },
    },
    scheduledSessions: [
      {
        contractId: {
          type: Schema.Types.ObjectId,
          ref: "Contract",
        },
        date: {
          type: Date,
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
          enum: ["Pendiente", "Completado", "Cancelado"],
          default: "Pendiente",
        },
      },
    ],
    fileIds: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Contract = mongoose.model("Contract", contractSchema);
module.exports = Contract;
