import React, { useState } from "react";
import { InputGroup, FormControl, Modal, Button, Form } from "react-bootstrap";
import { FilterButton } from "../filterButton/FilterButton";
import { Star } from "lucide-react";
import RatingDropdown from "../ratingDropDown/RatingDropDown";
import "./SearchBar.css";

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

      <Modal show={showFilters} onHide={handleCloseFilters} centered size="lg">
        <Modal.Body>
          <h5 className="mb-3">Filtrar Servicios</h5>
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
                <option>Online</option>
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
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseFilters}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleApplyFilters}>
            Aplicar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SearchBar;
