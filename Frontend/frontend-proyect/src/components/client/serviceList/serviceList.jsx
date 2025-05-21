import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ServiceCard from "../serviceCard/ServiceCard";
import "./ServiceList.css";

const ListaDeServicios = () => {
  const token = useSelector((state) => state.auth.token);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/services", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error("❌ Error al cargar los servicios:", error);
      }
    };

    if (token) fetchServices();
  }, [token]);

  return (
    <div className="d-flex flex-wrap justify-content-center">
      {services.map((s) => (
        <ServiceCard
          key={s._id}
          image={s.image}
          title={s.name}
          coachName={`${s.coachId.firstName} ${s.coachId.lastName}`}
          description={s.description}
          rating={s.averageRating || 5}
          price={s.price}
        />
      ))}
    </div>
  );
};

export default ListaDeServicios;
