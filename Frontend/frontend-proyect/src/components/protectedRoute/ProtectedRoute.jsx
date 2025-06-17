import { Navigate } from "react-router-dom";
import NotFound from "../../pages/NotFound";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user);
  console.log(token);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!user || !user.role) {
    return <NotFound />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "client") {
      return <Navigate to="/client-home" replace />;
    } else if (user.role === "coach") {
      return <Navigate to="/coach-home" replace />;
    }
    return <NotFound />;
  }
  return children;
};

export default ProtectedRoute;
