import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ServiceCardCoach from "../serviceCardCoach/ServiceCardCoach";
import AddServiceCard from "../addServiceCard/AddServiceCard";
import ServiceFormModal from "../serviceFormModal/ServiceFormModal";
import "./serviceListCoach.css";
import BaseServiceList from "../../baseServiceList/BaseServiceList";

const ServiceListCoach = () => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem("token");
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchServices = async () => {
      if (!token) return;

      try {
        const servicesResponse = await axios.get(
          `http://localhost:5000/api/services/coach/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Error al cargar servicios:", error.message);
      }
    };

    fetchServices();
  }, [token, userId]);

  const handleAddService = () => {
    setEditingService(null);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleSubmitService = async (formData, newImages) => {
    try {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          return;
        }

        if (key === "availability") {
          const availabilityString = JSON.stringify(formData[key]);
          form.append("availability", availabilityString);
        } else {
          if (formData[key] !== undefined && formData[key] !== null) {
            form.append(key, formData[key]);
          }
        }
      });

      if (formData.images && formData.images.length > 0) {
        const existingImagesString = JSON.stringify(formData.images);
        form.append("existingImages", existingImagesString);
      }

      if (newImages && newImages.length > 0) {
        newImages.forEach((image) => {
          form.append("images", image);
        });
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (editingService) {
        response = await axios.put(
          `http://localhost:5000/api/services/${editingService._id}`,
          form,
          config
        );
      } else {
        response = await axios.post(
          "http://localhost:5000/api/services",
          form,
          config
        );
      }

      if (editingService) {
        setServices((prev) =>
          prev.map((s) => (s._id === editingService._id ? response.data : s))
        );
      } else {
        setServices((prev) => [...prev, response.data]);
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error al guardar el servicio.");
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${serviceId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServices((prevServices) =>
          prevServices.filter((service) => service._id !== serviceId)
        );
      } catch (error) {
        console.error(error);
        alert("No se pudo eliminar el servicio.");
      }
    }
  };

  return (
    <BaseServiceList>
      {services.length > 0 ? (
        services.map((service) => (
          <ServiceCardCoach
            key={service._id}
            service={service}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))
      ) : (
        <p>No se encontraron servicios</p>
      )}
      <AddServiceCard onAddClick={handleAddService} />

      <ServiceFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitService}
        initialData={editingService}
      />
    </BaseServiceList>
  );
};

export default ServiceListCoach;
