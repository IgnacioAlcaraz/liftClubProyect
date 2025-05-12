require("dotenv").config();
const express = require("express");
const connectDB = require("./src/configs/db");
const userRoutes = require("./src/routes/user.routes");
const authRoutes = require("./src/routes/auth.routes");
const serviceRoutes = require("./src/routes/service.routes");
const contractRoutes = require("./src/routes/contract.routes");
const reviewRoutes = require("./src/routes/review.routes");
const passport = require("passport");
const session = require("express-session");
require("./src/configs/passport"); // Configuración de Passport

const app = express();

// Conectar a la base de datos
connectDB();

//middlewares
app.use(express.json());
app.use(
  session({ secret: "mysecret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/reviews", reviewRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
