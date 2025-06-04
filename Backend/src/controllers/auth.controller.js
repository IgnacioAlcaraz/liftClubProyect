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
const googleCallback = async (req, res) => {
  try {
    const result = await authService.handleGoogleCallback(req.user);

    if (result.redirect) {
      // Redirigir sin popup
      return res.redirect(result.url);
    }

    // Redirigir con token y rol al frontend
    return res.redirect(
      `http://localhost:5173/google-success?token=${result.data.token}&role=${result.data.user.role}`
    );
  } catch (error) {
    console.error("Error en googleCallback:", error.message);
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

const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await authService.getMe(userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const verifyResetPasswordCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyResetPasswordCode(email, code);
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "Código de restablecimiento de contraseña inválido o expirado"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const result = await authService.resetPassword(email, code, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "Código de restablecimiento de contraseña inválido o expirado"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  googleCallback,
  selectRole,
  getMe,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
};
