import { useSearchParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { googleLoginSuccess } from "../app/slices/authSlice";
import BaseModal from "../components/baseModal/BaseModal";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../components/secondaryButton/SecondaryButton";

const SelectRole = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Token temporal de Google
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!token) return <Navigate to="/" />;

  const handleSelectRole = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/select-role",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al seleccionar el rol");
      }

      const data = await response.json();
      const finalToken = data.token;

      localStorage.setItem("token", finalToken);
      dispatch(
        googleLoginSuccess({ token: finalToken, user: { role: data.role } })
      );

      if (data.role === "client") {
        setRedirect("/client-home");
      } else if (data.role === "coach") {
        setRedirect("/coach-home");
      } else {
        alert("Rol no reconocido");
      }
    } catch (error) {
      console.error("Error al seleccionar rol:", error.message);
      alert("Hubo un problema al seleccionar el rol");
    } finally {
      setLoading(false);
    }
  };

  if (redirect) return <Navigate to={redirect} />;

  return (
    <div className="login-wrapper">
      <BaseModal
        show={true}
        onClose={() => navigate("/")}
        title="Selecciona tu rol"
        footer={
          <div className="gap-2 w-100 d-flex justify-content-end">
            <SecondaryButton
              texto={loading ? "Cargando..." : "Confirmar"}
              onClick={handleSelectRole}
              disabled={!role || loading}
            />
          </div>
        }
      >
        <select
          className="form-select mb-3"
          onChange={(e) => setRole(e.target.value)}
          value={role}
        >
          <option value="">-- Selecciona uno --</option>
          <option value="client">Cliente</option>
          <option value="coach">Entrenador</option>
        </select>
      </BaseModal>
    </div>
  );
};

export default SelectRole;
