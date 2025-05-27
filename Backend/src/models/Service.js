const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

const serviceSchema = new mongoose.Schema(
  {
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    category: {
      type: String,
      enum: ["Running", "Gimnasio", "Nutrición", "Yoga", "Otro"],
    },
    description: String,
    zone: String,
    duration: Number,
    price: Number,
    modality: {
      type: String,
      enum: ["Presencial", "Virtual", "Híbrida"],
    },
    idiom: String,
    visibility: {
      type: String,
      enum: ["Pública", "Privada"],
    },
    images: [imageSchema],
    availability: [
      {
        dayOfWeek: {
          type: Number,
          min: 0,
          max: 6,
        },
        startTime: String,
        endTime: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/400x300",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
