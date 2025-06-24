import React, { useState } from "react";
import { InputGroup, FormControl, Form, Button } from "react-bootstrap";
import { FilterButton } from "../filterButton/FilterButton";
import RatingDropdown from "../ratingDropDown/RatingDropDown";
import BaseModal from "../../baseModal/BaseModal";
import "./SearchBar.css";
import SecondaryButton from "../../secondaryButton/SecondaryButton";

const SearchBar = ({ searchQuery, setSearchQuery, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    categoria: "",
    precioMin: "",
    precioMax: "",
    duracion: "",
    zona: "",
    idioma: "",
    modalidad: "",
    rating: "",
  });

  const handleFilterClick = () => setShowFilters(true);
  const handleCloseFilters = () => setShowFilters(false);

  const handleApplyFilters = () => {
    setFilters(localFilters);
    setShowFilters(false);
  };

  return (
    <div className="search-bar-container">
      <InputGroup className="search-input-group">
        <FormControl
          placeholder="¿Qué servicios estás buscando?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <FilterButton onClick={handleFilterClick} />

      <BaseModal
        show={showFilters}
        onClose={handleCloseFilters}
        title="Filtrar Servicios"
        footer={
          <div className="gap-2 w-100 d-flex justify-content-end">
            <SecondaryButton
              texto="Aplicar Cambios"
              onClick={handleApplyFilters}
            />
            <Button className="btn btn-secondary" onClick={handleCloseFilters}>
              Cerrar
            </Button>
          </div>
        }
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select
              value={localFilters.categoria}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  categoria: e.target.value,
                })
              }
            >
              <option value="">Todas</option>
              <option>Running</option>
              <option>Gimnasio</option>
              <option>Nutrición</option>
              <option>Yoga</option>
              <option>Otro</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-between mb-3">
            <Form.Group className="me-2 w-50">
              <Form.Label>Precio Mínimo</Form.Label>
              <Form.Control
                type="number"
                value={localFilters.precioMin}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    precioMin: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="ms-2 w-50">
              <Form.Label>Precio Máximo</Form.Label>
              <Form.Control
                type="number"
                value={localFilters.precioMax}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    precioMax: e.target.value,
                  })
                }
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Duración (Cantidad de sesiones)</Form.Label>
            <Form.Control
              type="number"
              value={localFilters.duracion}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, duracion: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Zona</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ej. Palermo, Recoleta..."
              value={localFilters.zona}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, zona: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Idioma</Form.Label>
            <Form.Control
              type="text"
              placeholder="Español, Inglés..."
              value={localFilters.idioma}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, idioma: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Modalidad</Form.Label>
            <Form.Select
              value={localFilters.modalidad}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  modalidad: e.target.value,
                })
              }
            >
              <option value="">Todas</option>
              <option>Presencial</option>
              <option>Virtual</option>
              <option>Híbrida</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Calificación mínima</Form.Label>
            <RatingDropdown
              value={localFilters.rating}
              onChange={(val) =>
                setLocalFilters({ ...localFilters, rating: val })
              }
            />
          </Form.Group>
        </Form>
      </BaseModal>
    </div>
  );
};

export default SearchBar;
