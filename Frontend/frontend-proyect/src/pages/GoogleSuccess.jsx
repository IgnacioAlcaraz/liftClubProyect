import { useSearchParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { googleLoginSuccess } from "../app/slices/authSlice";

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");
  const dispatch = useDispatch();
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    console.log("Token recibido desde GoogleSuccess:", token);
    console.log("Role recibido desde GoogleSuccess:", role);

    if (token && role) {
      const user = { role };

      dispatch(googleLoginSuccess({ token, user }));
      localStorage.setItem("token", token);

      if (role === "client") {
        setRedirect("/client-home");
      } else if (role === "coach") {
        setRedirect("/coach-home");
      } else {
        console.warn("Rol no reconocido:", role);
      }
    } else {
      console.warn("Token o rol faltante");
    }
  }, [token, role, dispatch]);

  if (redirect) return <Navigate to={redirect} />;
  return <p>Autenticando con Google...</p>;
};

export default GoogleSuccess;
