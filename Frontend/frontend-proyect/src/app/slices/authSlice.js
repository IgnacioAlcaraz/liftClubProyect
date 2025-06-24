import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (token && user && user.role) {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = tokenData.exp * 1000;

      if (Date.now() >= expirationTime) {
        localStorage.clear();
        return {
          isAuthenticated: false,
          token: null,
          user: null,
          loading: false,
          error: null,
        };
      }

      return {
        isAuthenticated: true,
        token,
        user,
        loading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error cargando desde localStorage:", error);
    localStorage.clear();
  }

  return {
    isAuthenticated: false,
    token: null,
    user: null,
    loading: false,
    error: null,
  };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },

    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.clear();
    },

    googleLoginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  googleLoginSuccess,
} = authSlice.actions;

export default authSlice.reducer;

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

    if (!data.token || !data.user || !data.user.role) {
      throw new Error("Respuesta del servidor incompleta");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    dispatch(loginSuccess(data));
  } catch (error) {
    console.error("Error completo:", error);
    localStorage.clear();
    dispatch(loginFailure(error.message));
  }
};
