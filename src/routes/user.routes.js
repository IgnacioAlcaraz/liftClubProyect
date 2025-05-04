// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth"); // Middleware de autenticación

// Rutas
// Obtener todos los usuarios - necesita autenticación
router.get("/", auth, userController.getUsers);

// Obtener un usuario por ID - necesita autenticación
router.get("/:id", auth, userController.getUserById);

// Actualizar un usuario - necesita autenticación
router.put("/:id", auth, userController.updateUser);

module.exports = router;
