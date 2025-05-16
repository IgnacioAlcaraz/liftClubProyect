const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    return res.status(201).json({
      message: "Usuario creado exitosamente",
      ...result,
    });
  } catch (error) {
    if (error.message === "El email ya está registrado") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);

    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Credenciales inválidas") {
      return res.status(401).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

// Callback de Google
const googleCallback = async (req, res) => {
  try {
    const result = await authService.handleGoogleCallback(req.user);

    // Si el usuario no tiene rol, se le redirige a la página de selección de rol
    if (result.redirect) {
      return res.redirect(result.url);
    }

    // Si el usuario tiene rol, se le genera un token y se redirige a la página de inicio
    return res.json(result.data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Seleccionar rol despues de autenticacion con google
const selectRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.user.id;

    // Seleccionar rol despues de autenticacion con google
    const result = await authService.selectRole(userId, role);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "El rol es requerido") {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = {
  register,
  login,
  googleCallback,
  selectRole,
};
