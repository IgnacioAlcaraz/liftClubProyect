import React from "react";
import { Paperclip } from "lucide-react";
import PrimaryButton from "../../primaryButton/PrimaryButton";
import LogoutButton from "../../logoutButton/LogoutButton";
import SearchBar from "../SearchBar/SearchBar";
import StepsBar from "../stepsBar/StepsBar";
import Header from "../../header/Header";
import "../../header/header.css";

const HeaderClient = ({
  showSearch = false,
  searchQuery = "",
  setSearchQuery = () => {},
  showSteps = false,
  currentStep = 1,
  showButtons = true,
  setFilters = () => {},
  showMisServiciosButton = true,
}) => {
  return (
    <Header onLogoClick="/client-home">
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
    </Header>
  );
};

export default HeaderClient;
