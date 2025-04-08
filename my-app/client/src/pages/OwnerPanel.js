import React from "react";
import { useNavigate } from "react-router-dom";
import './OwnerPanel.css';
import Navbar from "../components/Navbar"; 

const OwnerPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="owner-panel-container">
    <Navbar />
    <h2 className="owner-panel-title"> Grocery Store Owner Panel</h2>

      <div className="owner-panel-buttons">
        <button onClick={() => navigate("/create-order")}>Ordering from a Supplier</button>
        <button onClick={() => navigate("/orders-status")}>View Order Status</button>
        <button onClick={() => navigate("/confirm-orders")}>Confirm Order Received</button>
        <button onClick={() => navigate("/all-orders")}>All Orders</button>
      </div>
    </div>
  );
};

export default OwnerPanel;
