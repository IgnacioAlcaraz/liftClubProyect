const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "No hay token, autorización denegada",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (e2) {
        throw new Error("Token inválido");
      }
    }

    req.user = {
      userId: decoded.userId || decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Error de autenticación:", error);
    res.status(401).json({ message: "Token no válido" });
  }
};
