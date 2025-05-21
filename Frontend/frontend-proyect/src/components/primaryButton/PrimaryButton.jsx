import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./PrimaryButton.css";

const PrimaryButton = ({ icon: Icon, text, to, variant = "primary" }) => {
  const navigate = useNavigate();

  return (
    <Button variant={variant} onClick={() => navigate(to)}>
      {typeof Icon === "function" && <Icon className="me-2" size={18} />}
      {text}
    </Button>
  );
};

export default PrimaryButton;
