import React, { useState } from "react";
import ListaDeServicios from "../components/client/serviceList/serviceList";
import PrimaryButton from "../components/primaryButton/PrimaryButton";
import SearchBar from "../components/client/SearchBar/SearcBar";
import { Paperclip } from "lucide-react";

const ClientHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => {
          console.log("🧪 Filtro no implementado todavía");
        }}
      />
      <div className="container py-4">
        <PrimaryButton
          icon={Paperclip}
          text="Mis Servicios"
          to="/mis-servicios"
          variant="primary"
        />
        <h2 className="fw-bold mb-2">Encontra los mejores entrenadores...</h2>
        <p className="text-secondary mb-4">
          Descubre profesionales que te ayudarán a alcanzar objetivos
        </p>
        <ListaDeServicios searchQuery={searchQuery} />
      </div>
    </>
  );
};

export default ClientHome;
