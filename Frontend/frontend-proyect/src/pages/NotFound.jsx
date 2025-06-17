import React from "react";
import { Link } from "react-router-dom";
import SecondaryButton from "../components/secondaryButton/SecondaryButton";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="title-404">404</h1>
      <h2 className="title-404">Página no encontrada</h2>
      <p className="text-404">
        Lo sentimos, la página que estás buscando no existe o no tienes permiso
        para acceder a ella.
      </p>
      <Link to="/">
        <SecondaryButton texto="Volver al inicio" />
      </Link>
    </div>
  );
};

export default NotFound;
