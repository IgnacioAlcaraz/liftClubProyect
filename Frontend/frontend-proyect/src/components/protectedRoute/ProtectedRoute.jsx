import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, loginSuccess } from "../../app/slices/authSlice";
import { useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const clearSession = () => {
    localStorage.clear();
    dispatch(logout());
  };

  const isTokenExpired = (token) => {
    try {
      const tokenData = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= tokenData.exp * 1000;
    } catch {
      return true;
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (token && storedUser && storedUser.role && !isTokenExpired(token)) {
        dispatch(loginSuccess({ token, user: storedUser }));
      }
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !storedUser || !storedUser.role || isTokenExpired(token)) {
        clearSession();
        return <Navigate to="/" replace />;
      }

      return null;
    } catch (err) {
      console.error("Error verificando localStorage:", err);
      clearSession();
      return <Navigate to="/" replace />;
    }
  }

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    if (user && user.role) {
      const correctPath =
        user.role === "client" ? "/client-home" : "/coach-home";
      return <Navigate to={correctPath} replace />;
    } else {
      clearSession();
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
