const authService = require("../services/auth.service");

exports.register = async (req, res) => {
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

exports.login = async (req, res) => {
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
