import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ServiceCard from "../serviceCard/ServiceCard";
import axios from "axios";

const ListaDeServicios = ({ searchQuery }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setServices(response.data);
      } catch (error) {
        console.error("❌ Error al cargar los servicios:", error);
      }
    };

    if (token) fetchServices();
  }, [token]);

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {filteredServices.map((s) => (
        <ServiceCard
          key={s._id}
          image={s.image}
          title={s.name}
          coachName={`${s.coachId?.firstName || ""} ${
            s.coachId?.lastName || ""
          }`}
          description={s.description}
          rating={s.averageRating || 5}
          price={s.price}
        />
      ))}
    </div>
  );
};

export default ListaDeServicios;
