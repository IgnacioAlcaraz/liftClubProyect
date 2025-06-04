const User = require("../models/User");
const jwt = require("jsonwebtoken");
const emailService = require("./email.service");
require("dotenv").config();

const register = async (userData) => {
  const { email, password, firstName, lastName, birthDate, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const newUser = new User({
    email,
    password,
    firstName,
    lastName,
    birthDate,
    role: role,
  });

  await newUser.save();

  const token = jwt.sign(
    { userId: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
    },
  };
};

const login = async (credentials) => {
  const { email, password } = credentials;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Credenciales inválidas");
  }

  if (password !== user.password) {
    throw new Error("Credenciales inválidas");
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };
};

const handleGoogleCallback = async (googleUser) => {
  const existingUser = await User.findOne({ email: googleUser.email });

  if (!existingUser) {
    throw new Error(
      "El usuario no está registrado. Por favor, registrese primero."
    );
  }

  // Paso 3: Si existe pero no tiene rol, redirigir a selector de rol
  if (!existingUser.role) {
    const tempToken = jwt.sign(
      { id: existingUser._id },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    return {
      redirect: true,
      url: `http://localhost:5173/select-role?token=${tempToken}`,
    };
  }

  // Paso 4: Si tiene todo correcto, generar el token final
  const token = jwt.sign(
    { id: existingUser._id, role: existingUser.role },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  return {
    redirect: false,
    data: {
      token,
      user: {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
    },
  };
};

// Seleccionar rol despues de autenticacion con google
const selectRole = async (userId, role) => {
  if (!role) {
    throw new Error("El rol es requerido");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  user.role = role;
  await user.save();

  // Generar un token final para el usuario
  const finalToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  return {
    message: "Usuario actualizado correctamente",
    token: finalToken,
    role: user.role,
  };
};

const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Usuario no encontrado");
  }
  return user;
};

const generateResetPasswordCode = async () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  if (!user.password) {
    throw new Error("El usuario esta registrado con google");
  }

  const code = await generateResetPasswordCode();
  user.resetPasswordCode = code;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  await emailService.sendResetPasswordEmail(email, code);

  return {
    message: "Correo de restablecimiento de contraseña enviado correctamente",
  };
};

const verifyResetPasswordCode = async (email, code) => {
  const user = await User.findOne({
    email,
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error(
      "Código de restablecimiento de contraseña inválido o expirado"
    );
  }

  return {
    message: "Código de restablecimiento de contraseña válido",
  };
};

const resetPassword = async (email, code, newPassword) => {
  const user = await User.findOne({
    email,
    resetPasswordCode: code,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error(
      "Código de restablecimiento de contraseña inválido o expirado"
    );
  }

  user.password = newPassword;
  user.resetPasswordCode = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return {
    message: "Contraseña restablecida correctamente",
  };
};

module.exports = {
  register,
  login,
  handleGoogleCallback,
  selectRole,
  getMe,
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
};
