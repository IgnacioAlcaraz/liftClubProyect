import React from "react";
import { Button } from "react-bootstrap";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import { LogOut, Paperclip } from "lucide-react";
import SearchBar from "../SearchBar/SearchBar";
import StepsBar from "../StepsBar/StepsBar";
import LogoutButton from "../../LogoutButton";
import logo from "../../../assets/logo.png";

import "./Header.css";

const Header = ({
  showSearch = false,
  searchQuery = "",
  setSearchQuery = () => {},
  onFilterClick = () => {},
  showSteps = false,
  currentStep = 0,
  showButtons = true,
}) => {
  return (
    <div className="custom-header">
      <div className="left">
        {<img src={logo} alt="LiftClub" className="logo" />}
      </div>

      <div className="center">
        {showSearch && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onFilterClick={onFilterClick}
          />
        )}
        {showSteps && <StepsBar currentStep={currentStep} />}
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
