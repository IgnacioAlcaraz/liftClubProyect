import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function ClientPageMisServicios() {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");

  const [misContratos, setMisContratos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMisContratos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/contracts/cliente/mis-contratos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMisContratos(response.data);
        console.log(misContratos);
      } catch (err) {
        setError("No se pudieron cargar los contratos.");
      }
    };

    if (token) fetchMisContratos();
  }, [token]);

  return (
    <div className="container mt-4">
      <h2>Servicios Contratados</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {misContratos.length === 0 ? (
        <p>No tenés servicios contratados aún.</p>
      ) : (
        <ul className="list-group">
          {misContratos.map((c) => (
            <li key={c._id} className="list-group-item">
              <h5>{c.serviceId?.name || "Servicio no disponible"}</h5>
              <p>
                <strong>Profesor:</strong>{" "}
                {c.coachId
                  ? `${c.coachId.firstName} ${c.coachId.lastName}`
                  : "No disponible"}
              </p>
              <p>
                <strong>Estado:</strong> {c.status}
              </p>
              <p>
                <strong>Duración:</strong> {c.serviceId?.duration || "N/A"}{" "}
                sesiones
              </p>
              <p>
                <strong>Precio:</strong> {c.price} USD
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
