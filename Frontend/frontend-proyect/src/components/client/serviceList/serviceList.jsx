import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ServiceCard from "../serviceCard/ServiceCard";
import axios from "axios";

const ListaDeServicios = ({ searchQuery, filters = {} }) => {
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
        console.error("Error al cargar los servicios:", error);
      }
    };

    if (token) fetchServices();
  }, [token]);

  const filteredServices = services.filter((s) => {
    const nameMatch = s.name.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMatch =
      !filters.categoria || s.category === filters.categoria;
    const priceMinMatch =
      !filters.precioMin || s.price >= Number(filters.precioMin);
    const priceMaxMatch =
      !filters.precioMax || s.price <= Number(filters.precioMax);
    const durationMatch =
      !filters.duracion || s.duration === Number(filters.duracion);
    const locationMatch =
      !filters.zona ||
      s.zone?.toLowerCase().includes(filters.zona.toLowerCase());
    const languageMatch =
      !filters.idioma ||
      s.idiom?.toLowerCase().includes(filters.idioma.toLowerCase());
    const modeMatch =
      !filters.modalidad ||
      s.modality?.toLowerCase() === filters.modalidad.toLowerCase();
    const ratingMatch =
      !filters.rating || s.averageRating >= Number(filters.rating);

    const getImageUrl = (service) => {
      if (service.images && service.images.length > 0) {
        return `http://localhost:5000${service.images[0].url}`;
      }
      return service.image || "https://via.placeholder.com/400x300";
    };

    return (
      nameMatch &&
      categoryMatch &&
      priceMinMatch &&
      priceMaxMatch &&
      durationMatch &&
      locationMatch &&
      languageMatch &&
      modeMatch &&
      ratingMatch
    );
  });

  return (
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {filteredServices.map((s) => (
        <ServiceCard
          key={s._id}
          id={s._id}
          image={s.images?.[0]?.url || s.image}
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
