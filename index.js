require("dotenv").config();
const express = require("express");
const connectDB = require("./src/configs/db");
const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

// Conectar a la base de datos
connectDB();

//middlewares
app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
