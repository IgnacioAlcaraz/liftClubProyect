import ServiceCard from "../components/Login/ServiceCard";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ClientHome = () => {
  const token = useSelector((state) => state.auth.token);
  const [services, setServices] = useState([]);

  console.log("TOKEN EN REDUX:", token);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("RESPUESTA DEL BACKEND:", data);

        setServices(data);
      } catch (error) {
        console.error("❌ Error al cargar los servicios:", error);
      }
    };

    if (token) {
      fetchServices();
    }
  }, [token]);

  return (
    <div>
      <h2>Servicios disponibles</h2>

      <pre>{JSON.stringify(services, null, 2)}</pre>

      {services.map((s) => (
        <div key={s._id}>{s.nombre}</div>
      ))}

      <div className="d-flex flex-wrap gap-4 justify-content-center">
        {services.map((s) => (
          <ServiceCard
            key={s._id}
            image={s.image}
            title={s.name}
            coachName={`${s.coachId.firstName} ${s.coachId.lastName}`}
            description={s.description}
            rating={s.averageRating}
            price={s.price}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientHome;
