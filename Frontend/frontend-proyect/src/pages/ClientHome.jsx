import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ClientHome = () => {
  const token = useSelector((state) => state.auth.token);
  const [services, setServices] = useState([]);

  console.log("TOKEN EN REDUX:", token); // 🐞 Línea 1: Verificar token

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("RESPUESTA DEL BACKEND:", data); // 🐞 Línea 2: Verificar datos

        setServices(data);
      } catch (error) {
        console.error("❌ Error al cargar los servicios:", error); // 🐞 Línea 3: Errores de red
      }
    };

    if (token) {
      fetchServices(); // 🐞 Línea 4: Solo se llama si hay token
    }
  }, [token]);

  return (
    <div>
      <h2>Servicios disponibles</h2>

      {/* 🐞 Línea 5: Muestra los servicios crudos para ver qué llega */}
      <pre>{JSON.stringify(services, null, 2)}</pre>

      {services.map((s) => (
        <div key={s._id}>{s.nombre}</div>
      ))}
    </div>
  );
};

export default ClientHome;
