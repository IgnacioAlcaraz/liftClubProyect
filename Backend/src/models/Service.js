const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    modality: String,
    idiom: String,
    visibility: {
      type: String,
      enum: ["public", "private"],
    },
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
  },
  { timestamps: true }
);

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
