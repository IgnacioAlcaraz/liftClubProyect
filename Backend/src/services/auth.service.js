const User = require("../models/User");
const jwt = require("jsonwebtoken");
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

const handleGoogleCallback = async (user) => {
  if (!user.role) {
    const tempToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15m",
    });

    return {
      redirect: true,
      url: `http://localhost:5173/select-role?token=${tempToken}`,
    };
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  return {
    redirect: false,
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
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
  };
};

module.exports = {
  register,
  login,
  handleGoogleCallback,
  selectRole,
};
