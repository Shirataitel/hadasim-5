import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './OwnerLogin.css';

const OwnerLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const hardCodedPassword = "123456";
    if (password === hardCodedPassword) {
      navigate("/owner-panel");
    } else {
      setError("Wrong password, try again");
    }
  };

  return (
    <div className="owner-login-container">
      <h2 className="owner-login-title">Grocery store owner's login</h2>
      <form onSubmit={handleLogin} className="owner-login-form">
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      {error && <p className="owner-login-error">{error}</p>}
    </div>
  );
};

export default OwnerLogin;
