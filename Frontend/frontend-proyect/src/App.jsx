// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import SelectRole from "./pages/SelectRole";
import RegisterPage from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* <Route path="/client-home" element={<ClientHome />} /> */}
        {/* <Route path="/coach-home" element={<CoachHome />} /> */}
        {/* <Route path="/google-success" element={<GoogleSuccess />} /> */}
        <Route path="/select-role" element={<SelectRole />} />
      </Routes>
    </Router>
  );
};

export default App;
