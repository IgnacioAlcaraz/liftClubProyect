import React from "react";
import { Dropdown } from "react-bootstrap";
import { Star } from "lucide-react";

const RatingDropdown = ({ value, onChange }) => {
  const ratings = [5, 4, 3, 2, 1];

  const renderStars = (count) =>
    Array.from({ length: count }).map((_, i) => (
      <Star key={i} size={14} fill="#ffc107" stroke="#ffc107" />
    ));

  return (
    <Dropdown onSelect={(val) => onChange(val)} drop="down">
      <Dropdown.Toggle variant="light" className="w-100 text-start">
        {value ? renderStars(Number(value)) : "Todas"}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ position: "absolute", zIndex: 1051 }}>
        <Dropdown.Item eventKey="">Todas</Dropdown.Item>
        {ratings.map((n) => (
          <Dropdown.Item key={n} eventKey={n}>
            {renderStars(n)}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default RatingDropdown;
