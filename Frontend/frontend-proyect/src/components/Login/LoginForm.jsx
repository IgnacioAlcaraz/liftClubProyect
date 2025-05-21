import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../app/slices/authSlice";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import GoogleButton from "./GoogleButton";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // Redirige si el usuario se autentica, según el rol
  useEffect(() => {
    console.log("Usuario recibido:", user);

    if (isAuthenticated && user && user.role) {
      if (user.role === "client") {
        navigate("/client-home");
      } else if (user.role === "coach") {
        navigate("/coach-home");
      } else {
        console.warn("Rol no reconocido:", user.role);
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  return (
    <div className="login-card">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="text-center mb-4">Iniciar Sesión</h2>

        <InputField
          label="Email"
          type="email"
          name="email"
          placeholder="..."
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <div className="password-field">
          <InputField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="..."
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {error && <p className="text-danger text-center">{error}</p>}

        <SubmitButton
          text={loading ? "Cargando..." : "Iniciar sesión"}
          disabled={loading}
        />

        <p className="register-text">
          ¿No tienes una cuenta? <a href="/register">Regístrate</a>
        </p>

        <div className="divider">
          <hr /> <span>OR</span> <hr />
        </div>

        <GoogleButton />
      </form>
    </div>
  );
};

export default LoginForm;
