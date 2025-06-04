import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/input/InputField";
import SubmitButton from "../components/submitButton/SubmitButton";
import axios from "axios";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      setStep("code");
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error al enviar el correo", error);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/code-verification", {
        email,
        code,
      });
      setStep("new-password");
    } catch (error) {
      console.error("Error al verificar el código", error);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/auth/password-reset", {
        email,
        code,
        newPassword,
      });
      alert("Contraseña cambiada correctamente");
      navigate("/login");
    } catch (error) {
      console.error("Error al cambiar la contraseña", error);
    }
  };

  if (step === "email") {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <form onSubmit={handleEmailSubmit} className="login-form">
            <h2>Restablecer contraseña</h2>
            <p>
              Introduce tu mail y te enviaremos el link para cambiar tu
              contraseña
            </p>
            <InputField
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="button-container">
              <SubmitButton text="Enviar correo" />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (step === "code") {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <form onSubmit={handleCodeSubmit} className="login-form">
            <h2>Introduce el código de verificación</h2>
            <p>Te enviamos un código de verificación a tu correo</p>
            <InputField
              label="Código de verificación"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <div className="button-container">
              <SubmitButton text="Verificar código" />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/login")}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <form onSubmit={handlePasswordSubmit} className="login-form">
          <h2>Introduce tu nueva contraseña</h2>
          <InputField
            label="Nueva contraseña"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <InputField
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="button-container">
            <SubmitButton text="Cambiar contraseña" />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
