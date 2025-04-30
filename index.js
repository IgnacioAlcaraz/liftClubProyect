require("dotenv").config();
const connectDB = require("./src/configs/db");

// Conectar a la base de datos
connectDB();

// El resto de tu código...
