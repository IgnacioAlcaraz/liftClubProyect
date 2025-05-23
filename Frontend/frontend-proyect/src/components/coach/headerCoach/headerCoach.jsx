import React from "react";
import { BarChart } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { Bell } from "lucide-react";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import LogoutButton from "../../logoutButton/LogoutButton";
import logo from "../../../assets/logo.png";
import "./headerCoach.css";

const Header = () => {
  return (
    <div className="custom-header">
      <div className="left">
        <div className="logo-container">
          <img src={logo} alt="LiftClub" className="logo" />
        </div>
      </div>


      {(
        <div className="right">
            <PrimaryButton
            icon={BarChart}
            text="Estadisticas"
            to="/stats"
            variant="primary"
          />
          <PrimaryButton
            icon={Bell}
            text="Notificaciones"
            to="/notificaciones"
            variant="primary"
          />
          <PrimaryButton
            icon={CheckCircle}
            text="Servicios Aceptados"
            to="/servicios-aceptados"
            variant="primary"
          />

          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default Header;
