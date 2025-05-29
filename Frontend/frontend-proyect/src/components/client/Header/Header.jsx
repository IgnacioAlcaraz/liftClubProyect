import React from "react";
import { Paperclip } from "lucide-react";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import LogoutButton from "../../logoutButton/LogoutButton";
import SearchBar from "../SearchBar/SearchBar";
import StepsBar from "../stepsBar/StepsBar";
import logo from "../../../assets/logo.png";
import "./Header.css";

const Header = ({
  showSearch = false,
  searchQuery = "",
  setSearchQuery = () => {},
  showSteps = false,
  currentStep = 1,
  showButtons = true,
  setFilters = () => {},
}) => {

  return (
    <div className="custom-header">
      <div className="left">
        <div className="logo-container">
          <img src={logo} alt="LiftClub" className="logo" />
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
          <PrimaryButton
            icon={Paperclip}
            text="Mis Servicios"
            to="/mis-servicios"
            variant="primary"
          />
          <LogoutButton />
        </div>
      )}
    </div>
  );
};

export default Header;
