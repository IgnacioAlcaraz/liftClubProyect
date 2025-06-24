import { useSearchParams, Navigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { googleLoginSuccess } from "../app/slices/authSlice";
import BaseModal from "../components/baseModal/BaseModal";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../components/secondaryButton/SecondaryButton";

const SelectRole = () => {
  const [searchParams] = useSearchParams();
  const tempToken = searchParams.get("token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!tempToken) {
    return <Navigate to="/" />;
  }

  const handleSelectRole = async () => {
    if (!role) {
      setError("Debes seleccionar un rol");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/select-role",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tempToken}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al seleccionar el rol");
      }

      if (!data.token || !data.user || !data.user.role) {
        throw new Error("Respuesta del servidor incompleta");
      }

      localStorage.setItem("token", data.token);

      const userInfo = {
        id: data.user.id,
        role: data.user.role,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
      };

      localStorage.setItem("user", JSON.stringify(userInfo));

      dispatch(
        googleLoginSuccess({
          token: data.token,
          user: userInfo,
        })
      );

      const redirectPath =
        data.user.role === "client" ? "/client-home" : "/coach-home";
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setError(error.message || "Hubo un problema al seleccionar el rol");
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <BaseModal
        show={true}
        onClose={() => navigate("/")}
        title="Selecciona tu rol"
        staticBackdrop={true}
        footer={
          <div className="gap-2 w-100 d-flex justify-content-end">
            <SecondaryButton
              texto={loading ? "Procesando..." : "Confirmar"}
              onClick={handleSelectRole}
              disabled={!role || loading}
            />
          </div>
        }
      >
        <div className="mb-3">
          <select
            className="form-select"
            onChange={(e) => setRole(e.target.value)}
            value={role}
            disabled={loading}
          >
            <option value="">-- Selecciona uno --</option>
            <option value="client">Cliente</option>
            <option value="coach">Entrenador</option>
          </select>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </BaseModal>
    </div>
  );
};

export default SelectRole;
