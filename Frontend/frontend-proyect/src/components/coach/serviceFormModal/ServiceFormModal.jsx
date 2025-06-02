import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import "./ServiceFormModal.css";
import InputField from "../../input/InputField";
import AvailabilitySection from "./AvailabilitySection";

const ServiceFormModal = ({ show, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    zone: "",
    duration: "",
    price: "",
    modality: "",
    idiom: "",
    visibility: "public",
    images: [],
    availability: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        description: initialData.description || "",
        zone: initialData.zone || "",
        duration: initialData.duration || "",
        price: initialData.price || "",
        modality: initialData.modality || "",
        idiom: initialData.idiom || "",
        visibility: initialData.visibility || "",
        availability: initialData.availability || [],
      });

      const validImages = (initialData.images || []).filter(
        (img) => img && img.url
      );
      setExistingImages(validImages);
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        zone: "",
        duration: "",
        price: "",
        modality: "",
        idiom: "",
        visibility: "",
        images: [],
        availability: [],
      });
      setExistingImages([]);
    }
    if (!show) {
      setSelectedImages([]);
    }
  }, [initialData, show]);

  const handleRemoveExistingImage = (indexToRemove) => {
    const updatedImages = existingImages.filter(
      (_, index) => index !== indexToRemove
    );
    setExistingImages(updatedImages);
    setFormData((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const validFiles = files.filter((file) => {
        const isImage = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024;
        return isImage && isValidSize;
      });

      if (validFiles.length !== files.length) {
        alert(
          "Algunos archivos no son válidos. Asegúrate de que sean imágenes y no excedan 5MB."
        );
      }

      setSelectedImages((prevImages) => [...prevImages, ...validFiles]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModalityChange = (modality) => {
    setFormData((prev) => ({
      ...prev,
      modality: modality,
    }));
  };

  const handleLanguageChange = (idiom) => {
    setFormData((prev) => ({
      ...prev,
      idiom: idiom,
    }));
  };

  const handleVisibilityChange = (visibility) => {
    setFormData((prev) => ({
      ...prev,
      visibility: visibility,
    }));
  };

  const handleAvailabilityChange = (newAvailabilities) => {
    setFormData((prev) => ({
      ...prev,
      availability: newAvailabilities,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingImages.length === 0 && selectedImages.length === 0) {
      alert("Por favor, agrega al menos una imagen para el servicio.");
      return;
    }
    console.log("Datos del formulario a enviar:", formData);
    console.log("Disponibilidades:", formData.availability);
    onSubmit(
      {
        ...formData,
        images: existingImages,
      },
      selectedImages
    );
  };

  const renderExistingImage = (image, index) => {
    if (!image || !image.url) return null;

    return (
      <div key={index} className="existing-image-container">
        <img
          src={`http://localhost:5000${image.url}`}
          alt={image.name}
          className="thumbnail"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/assets/images/logo.png";
          }}
        />
        <div className="image-info">
          <span>{image.name}</span>
          <span>{(image.size / 1024).toFixed(2)} KB</span>
        </div>
        <button
          type="button"
          className="remove-image-btn"
          onClick={() => handleRemoveExistingImage(index)}
        >
          Eliminar
        </button>
      </div>
    );
  };

  if (!show) return null;

  return (
    <div className="modal-overlay shadow">
      <div className="modal-content">
        <h2>{initialData ? "Editar Servicio" : "Agregar Servicio"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="image-upload-section">
            {existingImages && existingImages.length > 0 && (
              <>
                <h3>Imágenes actuales</h3>
                <div className="existing-images">
                  {existingImages.map((image, index) =>
                    renderExistingImage(image, index)
                  )}
                </div>
              </>
            )}
            {selectedImages.length > 0 && (
              <>
                <h3>Imágenes nuevas seleccionadas</h3>
                <div className="selected-images">
                  {selectedImages.map((file, index) => (
                    <div key={index} className="selected-image-container">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Nueva imagen ${index + 1}`}
                        className="thumbnail"
                      />
                      <div className="image-info">
                        <span>{file.name}</span>
                      </div>
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => {
                          const newSelectedImages = selectedImages.filter(
                            (_, i) => i !== index
                          );
                          setSelectedImages(newSelectedImages);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="upload-section">
              <h3>Agregar nuevas fotos</h3>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="upload-button"
              />
              <small className="upload-info">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen
              </small>
            </div>
          </div>

          <div className="form-grid">
            <InputField
              label="Nombre"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre del servicio"
              required
            />

            <div className="form-group">
              <label>Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Seleccione una categoría</option>
                <option value="Running">Running</option>
                <option value="Gimnasio">Gimnasio</option>
                <option value="Nutrición">Nutrición</option>
                <option value="Yoga">Yoga</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <InputField
              label="Precio"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Precio"
              required
              min="0"
            />

            <InputField
              label="Duración (sesiones)"
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Duración en sesiones"
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descripción del servicio"
              className="form-control"
              required
            />
          </div>

          <AvailabilitySection
            availabilities={formData.availability}
            onAvailabilityChange={handleAvailabilityChange}
          />

          <div className="form-section">
            <h3>Modalidad</h3>
            <div className="button-group">
              {["Presencial", "Virtual", "Híbrida"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`option-button ${
                    formData.modality === mode ? "active" : ""
                  }`}
                  onClick={() => handleModalityChange(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Idioma</h3>
            <div className="button-group">
              {["Inglés", "Español"].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`option-button ${
                    formData.idiom === lang ? "active" : ""
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Visibilidad</h3>
            <div className="button-group">
              {["Pública", "Privada"].map((visibility) => (
                <button
                  key={visibility}
                  type="button"
                  className={`option-button ${
                    formData.visibility === visibility ? "active" : ""
                  }`}
                  onClick={() => handleVisibilityChange(visibility)}
                >
                  {visibility}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-confirm">
              {initialData ? "Guardar Cambios" : "Agregar Servicio"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormModal;
