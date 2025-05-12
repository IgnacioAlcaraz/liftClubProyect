const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    role: {
      type: String,
      required: false,
      enum: ["client", "coach"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true, //elimina los espacios
      lowercase: true,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    birthDate: {
      type: Date,
    },
  },
  {
    // Agrega automáticamente los campos createdAt y updatedAt
    timestamps: true,
  }
);

// Creamos el modelo User a partir del schema
const User = mongoose.model("User", userSchema);

module.exports = User;
