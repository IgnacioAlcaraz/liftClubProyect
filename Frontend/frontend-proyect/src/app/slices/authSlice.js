import { createSlice } from "@reduxjs/toolkit";

// Estado inicial del slice
const initialState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Inicia la carga de login
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Login exitoso con email/contraseña
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },

    // Login fallido
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Cierre de sesión
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    // 🔽 Login exitoso con Google
    googleLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
  },
});

// Exportación de las acciones
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  googleLoginSuccess,
} = authSlice.actions;

// Exportación del reducer
export default authSlice.reducer;

// 🔁 Thunk para login tradicional (fetch POST)
export const loginUser = (credentials) => async (dispatch) => {
  dispatch(loginStart());
  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la autenticación");
    }

    const data = await response.json();

    // Guardar token en localStorage
    localStorage.setItem("token", data.token);

    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFailure(error.message));
  }
};
