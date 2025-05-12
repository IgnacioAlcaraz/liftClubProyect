// middlewares/verifyTempToken.js
const jwt = require('jsonwebtoken');

const verifyTempToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token no válido o expirado" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyTempToken;
