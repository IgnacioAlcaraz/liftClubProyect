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
      // Si no tiene rol asignado, redirigir al frontend para elegirlo
      return res.redirect(`http://localhost:5000/api/users/select-role?userId=${req.user._id}`);
    }

    // Generar el JWT y devolverlo al cliente
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      role: req.user.role,
      message: `Bienvenido ${req.user.name}, tu rol es ${req.user.role}`,
    });
  }
);

module.exports = router;
