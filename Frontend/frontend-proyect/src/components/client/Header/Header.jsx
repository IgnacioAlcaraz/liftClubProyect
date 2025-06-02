import React from "react";
import { Paperclip } from "lucide-react";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import LogoutButton from "../../logoutButton/LogoutButton";
import SearchBar from "../SearchBar/SearchBar";
import StepsBar from "../stepsBar/StepsBar";
import logo from "../../../assets/logo.png";
import "./Header.css";
import { useNavigate } from "react-router-dom";

const Header = ({
  showSearch = false,
  searchQuery = "",
  setSearchQuery = () => {},
  showSteps = false,
  currentStep = 1,
  showButtons = true,
  setFilters = () => {},
  showMisServiciosButton = true,
}) => {
  const navigate = useNavigate();

  return (
    <div className="custom-header">
      <div className="left">
        <div className="logo-container">
          <img
            src={logo}
            alt="LiftClub"
            className="logo"
            onClick={() => navigate("/client-home")}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>

      <div className="center">
        {showSearch && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setFilters={setFilters}
          />
        )}
        {showSteps && <StepsBar step={currentStep} />}
      </div>

      {showButtons && (
        <div className="right">
          {showMisServiciosButton && (
            <PrimaryButton
              icon={Paperclip}
              text="Mis Servicios"
              to="/mis-servicios"
              variant="primary"
            />
          )}
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default Header;
