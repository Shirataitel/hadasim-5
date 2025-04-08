import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Modal.css";
import Navbar from "../components/Navbar";
import "./Orders.css"

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [unnotifiedOrders, setUnnotifiedOrders] = useState([]);
  const location = useLocation();
  const [showModal, setShowModal] = useState(false); 
  const { supplierId } = location.state || {};

  useEffect(() => {
    if (!supplierId) return;
    axios.get(`http://localhost:5000/api/orders/${supplierId}`)
      .then(response => {
        const ordersData = response.data;
        setOrders(ordersData.reverse());
        const unnotified = ordersData.filter(order => 
          order.status === "completed" && !order.notificationSeen
        );
        setUnnotifiedOrders(unnotified);
        if (unnotified.length > 0) {
          setShowModal(true);
        }
      })
      .catch(error => console.error("error to get orders", error));
  }, [supplierId]);

  const handleCloseModal = () => {
    setShowModal(false);
    unnotifiedOrders.forEach(async (order) => {
      try {
        await axios.patch(`http://localhost:5000/api/orders/notificationSeen/${order._id}`);
      } catch (error) {
        console.error("Error marking notification as seen", error);
      }
    });
  };

  const handleApproveOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}`);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status: "in-process" } : order
        )
      );
    } catch (error) {
      console.error("error in get order", error);
    }
  };

  return (
    <div className="orders-container">
    <Navbar />
      <h2 className="orders-title">My Orders</h2>
      {orders.length === 0 ? <p>You Not Have Orders Yet!</p> : (
        <table className="orders-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="product-item">
              {order.products.map(p => `${p.productId.name} (X${p.quantity})`).join(", ")}
              </td>
              <td>{order.status}</td>
              <td>
                {order.status === "holding" && (
                  <button className="approve-button" onClick={() => handleApproveOrder(order._id)}>
                    Accept
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>New Approved Orders</h3>
            <ul>
              {unnotifiedOrders.map(order => (
                <li key={order._id}>
                  <strong>Products:</strong> {order.products.map(p => `${p.productId.name} (Quantity: ${p.quantity})`).join(", ")}
                  <br />
                </li>
              ))}
            </ul>
            <button className="modal-close-button" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
