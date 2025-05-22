import React from "react";
import { useNavigate } from "react-router-dom";
import "./PrimaryButton.css";

const PrimaryButton = ({ icon: Icon, text, to, variant = "primary" }) => {
  const navigate = useNavigate();

  return (
    <button
      className="btn-confirm"
      variant={variant}
      onClick={() => navigate(to)}
    >
      {typeof Icon === "function" && <Icon className="me-2" size={18} />}
      {text}
    </button>
  );
};

export default PrimaryButton;
