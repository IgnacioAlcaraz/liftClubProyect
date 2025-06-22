import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/input/InputField";
import axios from "axios";
import BaseModal from "../components/baseModal/BaseModal";
import { Button } from "react-bootstrap";
import SecondaryButton from "../components/secondaryButton/SecondaryButton";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });
      setStep("code");
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error al enviar el correo", error);
    } finally {
      setLoading(false);
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
      alert(error.response.data.message);
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
      <BaseModal
        show={step === "email"}
        onClose={() => navigate("/login")}
        title="Restablecer contraseña"
        staticBackdrop={true}
        footer={
          <div className="gap-2 w-100 d-flex justify-content-end">
            <Button
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Cancelar
            </Button>
            <SecondaryButton
              texto={loading ? "Enviando correo..." : "Enviar correo"}
              onClick={handleEmailSubmit}
              disabled={loading}
            />
          </div>
        }
      >
        <p>
          Introduce tu mail y te enviaremos el link para cambiar tu contraseña
        </p>
        <InputField
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </BaseModal>
    );
  }

  if (step === "code") {
    return (
      <BaseModal
        show={step === "code"}
        onClose={() => navigate("/login")}
        title="Introduce el código de verificación"
        staticBackdrop={true}
        footer={
          <div className="gap-2 w-100 d-flex justify-content-end">
            <Button
              className="btn btn-secondary"
              onClick={() => navigate("/login")}
            >
              Cancelar
            </Button>
            <SecondaryButton
              texto="Verificar código"
              onClick={handleCodeSubmit}
            />
          </div>
        }
      >
        <p>Te enviamos un código de verificación a tu correo</p>
        <InputField
          label="Código de verificación"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </BaseModal>
    );
  }

  return (
    <BaseModal
      show={step === "new-password"}
      onClose={() => navigate("/login")}
      title="Introduce tu nueva contraseña"
      staticBackdrop={true}
      footer={
        <div className="gap-2 w-100 d-flex justify-content-end">
          <Button
            className="btn btn-secondary"
            onClick={() => navigate("/login")}
          >
            Cancelar
          </Button>
          <SecondaryButton
            texto="Cambiar contraseña"
            onClick={handlePasswordSubmit}
          />
        </div>
      }
    >
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
    </BaseModal>
  );
};

export default PasswordReset;
