import React from "react";
import { Button } from "react-bootstrap";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../app/slices/authSlice"; // ajustá ruta si cambia

const LogoutButton = ({ variant = "outline-secondary" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Limpiar Redux
    dispatch(logout());
    // Limpiar localStorage (por si acaso)
    localStorage.removeItem("token");
    // Redirigir
    navigate("/");
  };

  return (
    <Button variant={variant} onClick={handleLogout}>
      <LogOut />
    </Button>
  );
};

export default LogoutButton;
