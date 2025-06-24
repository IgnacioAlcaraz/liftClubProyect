const User = require("../models/User");
const jwt = require("jsonwebtoken");
const emailService = require("./email.service");
require("dotenv").config();

const validatePassword = (password) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*,.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push("La contraseña debe tener al menos 8 caracteres");
  }

  if (!hasUppercase) {
    errors.push("La contraseña debe tener al menos una letra mayúscula");
  }

  if (!hasNumber) {
    errors.push("La contraseña debe tener al menos un número");
  }

  if (!hasSpecialChar) {
    errors.push("La contraseña debe tener al menos un carácter especial");
  }

  return errors;
};

const register = async (userData) => {
  const { email, password, firstName, lastName, birthDate, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("El email ya está registrado");
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    throw new Error(passwordErrors.join(", "));
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

  const result = {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  };

  return result;
};

const handleGoogleCallback = async (googleUser) => {
  const existingUser = await User.findOne({ email: googleUser.email });

  if (existingUser && existingUser.role) {
    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      redirect: false,
      data: {
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          role: existingUser.role,
        },
      },
    };
  }

  if (!existingUser) {
    const newUser = new User({
      email: googleUser.email,
      firstName: googleUser.firstName,
      lastName: googleUser.lastName,
      role: null,
    });
    await newUser.save();
  }

  const tempToken = jwt.sign(
    {
      googleData: {
        email: googleUser.email,
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
      },
    },
    process.env.SECRET_KEY,
    { expiresIn: "15m" }
  );

  return {
    redirect: true,
    url: `http://localhost:5173/select-role?token=${tempToken}`,
  };
};

const selectRole = async (googleData, role) => {
  if (!role) {
    throw new Error("El rol es requerido");
  }

  if (!googleData || !googleData.email) {
    throw new Error("Datos de Google inválidos");
  }

  const user = await User.findOne({ email: googleData.email });

  if (!user) {
    throw new Error(
      "Usuario no encontrado. Error en el flujo de autenticación."
    );
  }

  if (user.role && user.role !== null) {
    throw new Error("El usuario ya tiene un rol asignado");
  }

  user.role = role;
  await user.save();

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const result = {
    token,
    user: {
      id: user._id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };

  return result;
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
  forgotPassword,
  verifyResetPasswordCode,
  resetPassword,
};
