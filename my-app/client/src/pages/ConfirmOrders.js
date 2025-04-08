import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./ConfirmOrders.css";

function ConfirmOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/all",{params: { status: "in-process" }});
        console.log(response.data)
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders in process", error);
      }
    };

    fetchOrders();
  }, []);

  const handleConfirm = async (orderId) => {
    try {
      await axios.patch(`http://localhost:5000/api/orders/confirm/${orderId}`, {
        status: "completed",
      });
      setOrders(orders.filter((order) => order._id !== orderId));
      showMessage("Order confirmed", "success");
    } catch (error) {
      console.error("Error confirming order", error);
      showMessage("Error confirming order", error);
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  return (
    <div className="confirm-orders-container">
    <Navbar showBack />
      <h2 className="confirm-orders-title">Confirm Orders</h2>
      {message && (
        <div className={`order-message ${messageType}`}>
          {message}
        </div>
      )}
      {orders.length === 0 ? (
        <p className="no-orders-msg">No orders in process</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Products</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.supplierId.companyName}</td>
                <td>
                  {order.products.map((product) => (
                    <div key={product.productId} className="product-item">
                      {product.productId.name} (x{product.quantity})
                    </div>
                  ))}
                </td>
                <td>
                  <button className="confirm-button" onClick={() => handleConfirm(order._id)}>Confirm Order</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ConfirmOrders;
