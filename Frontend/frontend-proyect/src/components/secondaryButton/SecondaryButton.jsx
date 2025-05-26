// components/PayButton.jsx
import React from "react";

const SecondaryButton = ({
  onClick,
  disabled = false,
  texto = "",
  className = "",
}) => {
  return (
    <button
      type="submit"
      className={`btn btn-primary ${className}`}
      style={{ backgroundColor: "#7b42f6" }}
      onClick={onClick}
      disabled={disabled}
    >
      {texto}
    </button>
  );
};

export default SecondaryButton;
