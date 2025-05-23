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
      {Icon && (
        <span className="button-icon">
          <Icon size={18} />
        </span>
      )}
      <span className="button-text">{text}</span>
    </button>
  );
};

export default PrimaryButton;
