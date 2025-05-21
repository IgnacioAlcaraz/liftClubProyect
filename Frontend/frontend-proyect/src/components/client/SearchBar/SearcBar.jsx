import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Search, Filter } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, onFilterClick }) => {
  return (
    <div className="d-flex justify-content-center align-items-center mb-4">
      <InputGroup
        style={{ maxWidth: "600px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
      >
        <FormControl
          placeholder="Que servicios estas buscando ?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="light">
          <Search size={18} />
        </Button>
      </InputGroup>
      <Button
        variant="outline-secondary"
        className="ms-2"
        onClick={onFilterClick}
      >
        <Filter size={18} />
      </Button>
    </div>
  );
};

export default SearchBar;
