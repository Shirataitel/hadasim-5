import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ showBack = false }) => {
  const navigate = useNavigate();

  return (
    <div className="navbar-container">
    <button className="navbar-btn" onClick={() => navigate("/")}>
    🏠
  </button>
      {showBack && (
        <button className="navbar-btn" onClick={() => navigate("/owner-panel")}>
        Go-Back
      </button>
      )}
    </div>
  );
};

export default Navbar;
