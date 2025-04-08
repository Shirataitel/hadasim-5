import React from "react";
import { useNavigate } from "react-router-dom";
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the grocery store management system</h1>
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate("/owner-login")}>
        Grocery store owner's login
        </button>
        <button className="home-button" onClick={() => navigate("/supplier-login")}>
        Existing supplier login
        </button>
        <button className="home-button" onClick={() => navigate("/register")}>
        New supplier register
        </button>
      </div>
    </div>
  );
};

export default Home;
