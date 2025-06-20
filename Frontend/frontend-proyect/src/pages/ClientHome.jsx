import React, { useState } from "react";
import ListaDeServicios from "../components/client/serviceList/serviceList";
import HeaderClient from "../components/client/headerClient/HeaderClient";

const ClientHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  return (
    <>
      <HeaderClient
        showSearch={true}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showButtons={true}
        setFilters={setFilters}
      />

      <div className="container py-4">
        <h2 className="fw-bold mb-2">Encontra los mejores entrenadores...</h2>
        <p className="text-secondary mb-4">
          Descubre profesionales que te ayudarán a alcanzar objetivos
        </p>
        <ListaDeServicios searchQuery={searchQuery} filters={filters} />
      </div>
    </>
  );
};

export default ClientHome;
