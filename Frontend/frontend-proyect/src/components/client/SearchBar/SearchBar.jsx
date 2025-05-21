import React from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { Search, Filter } from "lucide-react";
import "./SearchBar.css";

const SearchBar = ({ searchQuery, setSearchQuery, onFilterClick }) => {
  return (
    <div className="search-bar-container">
      <InputGroup className="search-input-group">
        <FormControl
          placeholder="¿Qué servicios estás buscando?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <Button className="filter-button" onClick={onFilterClick}>
        <Filter size={18} />
      </Button>
    </div>
  );
};

export default SearchBar;
