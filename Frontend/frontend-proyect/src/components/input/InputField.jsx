import React from "react";

const InputField = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  required,
  icon,
  min,
}) => {
  return (
    <div className="form-group position-relative">
      <label className="form-label">{label}</label>
      <input
        type={type}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={icon ? { paddingRight: "40px" } : {}}
        min={min}
      />
      {icon && <span className="eye-icon">{icon}</span>}
    </div>
  );
};

export default InputField;
