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

const handleGoogleCallback = async (googleUser) => {
  // Paso 1: Buscar si el usuario ya existe en la base de datos
  const existingUser = await User.findOne({ email: googleUser.email });

  if (!existingUser) {
    // Paso 2: Si no existe, lo rechazamos o lo redirigimos a registrarse
    throw new Error(
      "El usuario no está registrado. Por favor, registrese primero."
    );
    // O redirigir a una pantalla para completar el registro:
    // return {
    //   redirect: true,
    //   url: `http://localhost:5173/register-google?email=${googleUser.email}`
    // };
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

module.exports = {
  register,
  login,
  handleGoogleCallback,
  selectRole,
};
