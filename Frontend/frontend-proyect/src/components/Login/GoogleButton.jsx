import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { googleLoginSuccess } from "../../app/slices/authSlice";

const GoogleButton = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Datos recibidos desde Google:", event.data);

      const { token, user } = event.data;

      if (token && user) {
        // Guardar en Redux y localStorage
        dispatch(googleLoginSuccess({ token, user }));
        localStorage.setItem("token", token);

        // Redirigir según el rol
        if (user.role === "client") {
          window.location.href = "/client-home";
        } else if (user.role === "coach") {
          window.location.href = "/coach-home";
        } else {
          console.warn("Rol no reconocido:", user.role);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button type="button" className="google-btn" onClick={handleGoogleLogin}>
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="google-icon"
      />
      Iniciar sesión con Google
    </button>
  );
};

export default GoogleButton;
