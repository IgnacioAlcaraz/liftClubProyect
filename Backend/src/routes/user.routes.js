// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth"); // Middleware de autenticación
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyTempToken = require("../middlewares/verifyTempToken");

// Rutas
// Obtener todos los usuarios - necesita autenticación
router.get("/", auth, userController.getUsers);

// Obtener un usuario por ID - necesita autenticación
router.get("/:id", auth, userController.getUserById);

// Actualizar un usuario - necesita autenticación
router.put("/:id", auth, userController.updateUser);


//actualizar rol, nombre, y apellido
router.post("/select-role", verifyTempToken, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ message: "El rol es requerido" });
    }

   

    // Obtener el ID del usuario desde el middleware
    const userId = req.user.id;

    // Actualizar el usuario en la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.role = role;

    await user.save();

    // Generar el token definitivo con el nuevo rol
    const finalToken = jwt.sign(
      {
        id: user._id,
        role: user.role,

      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: `Usuario actualizado correctamente.`,
      token: finalToken,
    });
  } catch (error) {
    console.error("Error al asignar el rol:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
