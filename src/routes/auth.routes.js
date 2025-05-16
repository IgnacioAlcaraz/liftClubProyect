// routes/auth.routes.js
const express = require("express");
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

// Ruta para iniciar el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback que Google redirige después de autenticación
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user.role) {
      //  Generar un token temporal para el selector de roles
      const tempToken = jwt.sign(
        { id: req.user._id },
        process.env.SECRET_KEY,
        { expiresIn: '15m' } // Solo 15 minutos de validez
      );

      //  Redirigir al frontend con el token en la URL, ASUMIENDO QUE EL FRONT CORRE EN PUERETO 3000
      return res.redirect(`http://localhost:3000/select-role?token=${tempToken}`);
    }

    //  Si ya tiene rol asignado, se genera el token definitivo
    const token = jwt.sign(
      { id: req.user._id, role: req.user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: req.user.role,
      message: `Bienvenido ${req.user.name}, tu rol es ${req.user.role}`,
    });
  }
);

module.exports = router;
