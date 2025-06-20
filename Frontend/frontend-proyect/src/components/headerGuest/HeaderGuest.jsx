import React from "react";
import Header from "../header/Header";
import PrimaryButton from "../primaryButton/PrimaryButton";
import { LogIn, UserPlus } from "lucide-react";
import SearchBar from "../client/SearchBar/SearchBar";

const HeaderGuest = ({ searchQuery, setSearchQuery, setFilters }) => {
  return (
    <>
      <Header onLogoClick="/">
        <div className="center">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setFilters={setFilters}
          />
        </div>
        <div className="right">
          <PrimaryButton
            to="/login"
            text="Iniciar Sesión"
            icon={LogIn}
            variant="primary"
          ></PrimaryButton>
          <PrimaryButton
            to="/register"
            text="Registrarse"
            icon={UserPlus}
            variant="primary"
          ></PrimaryButton>
        </div>
      </Header>
    </>
  );
};

export default HeaderGuest;
