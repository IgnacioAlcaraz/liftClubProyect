import React, { useState } from "react";
import HeaderGuest from "../components/headerGuest/HeaderGuest";
import ServiceListClient from "../components/client/serviceList/serviceListClient";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  return (
    <>
      <HeaderGuest
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilters={setFilters}
      />
      <div className="container py-4">
        <h2 className="fw-bold mb-2">Descubre Nuestros Servicios...</h2>
        <p className="text-secondary mb-4">
          Inicia sesión para ver más detalles y comenzar tu entrenamiento
        </p>
        <ServiceListClient
          searchQuery={searchQuery}
          filters={filters}
          isGuest={true}
        />
      </div>
    </>
  );
};

export default Home;
