import React from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ children, onLogoClick }) => {
  const navigate = useNavigate();

  return (
    <div className="custom-header">
      <div className="left">
        <div className="logo-container">
          <img
            src={logo}
            alt="logo"
            className="logo"
            onClick={() => navigate(onLogoClick)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
