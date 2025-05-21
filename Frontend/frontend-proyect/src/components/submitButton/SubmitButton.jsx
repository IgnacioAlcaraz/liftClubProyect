import React from "react";
import "./SubmitButton.css";

const SubmitButton = ({ text }) => {
  return (
    <button type="submit" className="submit-btn btn w-100">
      {text}
    </button>
  );
};

export default SubmitButton;
