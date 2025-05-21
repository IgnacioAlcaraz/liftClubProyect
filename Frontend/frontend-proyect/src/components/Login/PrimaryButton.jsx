import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

const PrimaryButton = ({ icon: Icon, text, to, variant = "primary" }) => {
  const navigate = useNavigate();

  return (
    <Button variant={variant} onClick={() => navigate(to)}>
      {/* Verifica que Icon sea una función válida antes de usarlo */}
      {typeof Icon === "function" && <Icon className="me-2" size={18} />}
      {text}
    </Button>
  );
};

export default PrimaryButton;
