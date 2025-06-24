import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/slices/authSlice";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const clearSession = () => {
    localStorage.clear();
    dispatch(logout());
  };

  if (!isAuthenticated) {
    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");

      if (!token || !storedUser || !storedUser.role) {
        return <Navigate to="/" replace />;
      }

      window.location.reload();
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
