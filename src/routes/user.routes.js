// routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth"); // Middleware de autenticación
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Rutas
// Obtener todos los usuarios - necesita autenticación
router.get("/", auth, userController.getUsers);

// Obtener un usuario por ID - necesita autenticación
router.get("/:id", auth, userController.getUserById);

// Actualizar un usuario - necesita autenticación
router.put("/:id", auth, userController.updateUser);

router.post("/select-role", async (req, res) => {
  const { userId, role } = req.body;

  if (!["coach", "cliente"].includes(role)) {
    return res.status(400).json({ message: "Rol no válido." });
  }

  try {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });

    // Generar el JWT con el rol actualizado
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      message: `Rol actualizado correctamente a ${user.role}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el rol." });
  }
});

module.exports = router;

module.exports = router;
