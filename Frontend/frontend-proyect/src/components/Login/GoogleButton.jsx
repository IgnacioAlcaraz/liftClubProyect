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
    window.open(
      "http://localhost:5000/api/auth/google",
      "_blank",
      "width=500,height=600"
    );
  };

  return (
    <button type="button" className="google-btn" onClick={handleGoogleLogin}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
        alt="Google"
        className="google-icon"
      />
      Iniciar sesión con Google
    </button>
  );
};

export default GoogleButton;
