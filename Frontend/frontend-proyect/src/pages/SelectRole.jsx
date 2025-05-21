import { useSearchParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { googleLoginSuccess } from "../app/slices/authSlice";

const SelectRole = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Token temporal de Google
  const dispatch = useDispatch();

  const [role, setRole] = useState("");
  const [redirect, setRedirect] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!token) return <Navigate to="/" />;

  const handleSelectRole = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/select-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al seleccionar el rol");
      }

      const data = await response.json();
      const finalToken = data.token;

      // Guardar token final en localStorage y Redux
      localStorage.setItem("token", finalToken);
      dispatch(googleLoginSuccess({ token: finalToken, user: { role: data.role } }));

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
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Selecciona tu rol</h2>
      <select
        onChange={(e) => setRole(e.target.value)}
        value={role}
        style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
      >
        <option value="">-- Selecciona uno --</option>
        <option value="client">Cliente</option>
        <option value="coach">Entrenador</option>
      </select>
      <button
        onClick={handleSelectRole}
        disabled={!role || loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Cargando..." : "Confirmar"}
      </button>
    </div>
  );
};

export default SelectRole;