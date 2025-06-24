import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../app/slices/authSlice";
import InputField from "../components/input/InputField";
import SubmitButton from "../components/submitButton/SubmitButton";
import GoogleButton from "../components/googleButton/GoogleButton";
import { Eye, EyeOff } from "lucide-react";
import "../components/loginForm/loginForm.css";

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
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*,.?":{}|<>]/.test(password);

    const errors = [];

    if (password.length < minLength) {
      errors.push(`Mínimo ${minLength} caracteres`);
    }
    if (!hasUppercase) {
      errors.push("Una mayúscula");
    }
    if (!hasNumber) {
      errors.push("Un número");
    }
    if (!hasSpecialChar) {
      errors.push("Un carácter especial");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });

    if (name === "password") {
      const errors = validatePassword(value);
      if (errors.length > 0) {
        setPasswordError(`La contraseña debe tener: ${errors.join(", ")}`);
      } else {
        setPasswordError("");
      }
    }
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

      if (!user || !user.role || !["client", "coach"].includes(user.role)) {
        throw new Error("Rol de usuario inválido");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(loginSuccess({ token, user }));

      const redirectPath =
        user.role === "client" ? "/client-home" : "/coach-home";
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Crear cuenta</h2>

          <div className="form-group">
            <label>Seleccione su rol</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">--</option>
              <option value="client">Cliente</option>
              <option value="coach">Entrenador</option>
            </select>
          </div>

          <h4>Información Personal</h4>

          <div className="name-fields">
            <InputField
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <InputField
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="password-field" style={{ position: "relative" }}>
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                cursor: "pointer",
                color: "#666",
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            {passwordError && (
              <small className="text-danger">{passwordError}</small>
            )}
          </div>

          <InputField
            type="date"
            name="birthDate"
            placeholder="Fecha de Nacimiento"
            value={form.birthDate}
            onChange={handleChange}
            required
          />

          {error && <p className="text-danger text-center">{error}</p>}

          <SubmitButton
            text={loading ? "Registrando..." : "Completar registro"}
            disabled={loading}
          />

          <p className="register-text">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>

          <div className="divider">
            <hr /> <span>O</span> <hr />
          </div>

          <GoogleButton />
        </form>
      </div>
    </div>
  );
};

export default Register;
