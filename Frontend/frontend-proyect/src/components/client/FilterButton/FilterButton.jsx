import React from "react";
import { Filter } from "lucide-react";
import "./FilterButton.css";

export const FilterButton = ({ onClick }) => {
  return (
    <button className="filter-button" onClick={onClick}>
      <Filter className="filter-icon" size={18}></Filter>
    </button>
  );
};
