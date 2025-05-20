// src/components/Login/SubmitButton.jsx
import React from "react";

const SubmitButton = ({ text }) => {
  return (
    <button type="submit" className="btn btn-primary w-100">
      {text}
    </button>
  );
};

export default SubmitButton;
