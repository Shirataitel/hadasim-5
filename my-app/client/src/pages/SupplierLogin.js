import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./SupplierLogin.css"; 

const SupplierLogin = () => {
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/suppliers/login", {
        companyName,
        phoneNumber,
        representativeName
      });

      const supplier = response.data;
      navigate("/orders", { state: { supplierId: supplier._id } });
    } catch (err) {
      setError("supplier doesnt exist");
    }
  };

  return (
    <div className="supplier-login-container">
    <Navbar />
      <h2 className="supplier-login-title">Existing supplier login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="input-field"
        /><br />
        <input
          type="text"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input-field"
        /><br />
        <input
          type="text"
          placeholder="Representative Name"
          value={representativeName}
          onChange={(e) => setRepresentativeName(e.target.value)}
          className="input-field"
        /><br />
        <button type="submit" className="login-button">Login</button>
      </form>
      {error && <p  className="error-message">{error}</p>}
    </div>
  );
};

export default SupplierLogin;
