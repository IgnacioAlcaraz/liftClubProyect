import React, { useState } from "react";
import ListaDeServicios from "../components/client/serviceList/serviceList";
import PrimaryButton from "../components/primaryButton/PrimaryButton";
import Header from "../components/client/Header/Header";
import { Paperclip } from "lucide-react";

const ClientHome = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Header
        showSearch={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFilterClick={() => console.log("Filtro no implementado")}
        showButtons={true}
      />

      <div className="container py-4">
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
