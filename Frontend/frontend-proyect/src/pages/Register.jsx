import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../app/slices/authSlice";
import InputField from "../components/input/InputField";
import SubmitButton from "../components/submitButton/SubmitButton";
import GoogleButton from "../components/googleButton/GoogleButton";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    birthDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar");
      }

      const { token, user } = data;

      localStorage.setItem("token", token);
      dispatch(loginSuccess({ token, user }));

      if (user.role === "client") {
        navigate("/client-home");
      } else if (user.role === "coach") {
        navigate("/coach-home");
      } 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
      <h2 style={{ fontWeight: "bold" }}>Crear cuenta</h2>

      <form onSubmit={handleSubmit}>
        <label>Seleccione su rol</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <option value="">--</option>
          <option value="client">Cliente</option>
          <option value="coach">Entrenador</option>
        </select>

        <h4>Información Personal</h4>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <InputField
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={form.firstName}
            onChange={handleChange}
          />
          <InputField
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={form.lastName}
            onChange={handleChange}
          />
        </div>

        <InputField
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <InputField
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <InputField
          type="date"
          name="birthDate"
          placeholder="Fecha de Nacimiento"
          value={form.birthDate}
          onChange={handleChange}
        />

        {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}

        <SubmitButton
          text={loading ? "Registrando..." : "Completar registro"}
          disabled={loading}
        />
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        ¿Ya tienes una cuenta? <Link to="/">Inicia sesión</Link>
      </p>

      <hr />
      <GoogleButton />
    </div>
  );
};

export default Register;
