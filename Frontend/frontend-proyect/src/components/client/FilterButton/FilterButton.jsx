import React from "react";
import { Button } from "react-bootstrap";
import { Filter } from "lucide-react";
export const FilterButton = ({ onClick }) => {
  return (
    <Button className="filter-button" onClick={onClick}>
      <Filter size={18}></Filter>
    </Button>
  );
};

