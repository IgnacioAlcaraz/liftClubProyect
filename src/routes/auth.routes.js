const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyTempToken = require("../middlewares/verifyTempToken");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  authController.googleCallback
);

router.post("/select-role", verifyTempToken, authController.selectRole);

module.exports = router;
