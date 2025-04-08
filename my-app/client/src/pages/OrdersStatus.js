import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; 
import "./OrdersStatus.css";

function OrdersStatus() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/all",{params: { status: ["holding", "in-process"] }});
        setOrders(response.data); 
      } catch (error) {
        console.error("Error fetching orders", error);
        alert("There was an error fetching the orders.");
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-status-container">
    <Navbar showBack />
    <h2 className="orders-status-title">Orders Status</h2>
    {orders.length === 0 ? (
      <p className="no-orders-msg">No open orders</p>
    ) : (
      <table className="orders-table">
        <thead>
          <tr>
          <th>Supplier</th>
            <th>Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="order-supplier">
              {order.supplierId.companyName}
              </td>  
              <td>
              <ul className="product-list">
                {order.products.map((product, index) => (
                  <li key={index} className="product-item">
                    {product.productId.name} (x{product.quantity})
                  </li>
                ))}
              </ul>
            </td>
              <td className={`order-status ${order.status === 'completed' ? 'completed' : order.status === 'in-process' ? 'in-process' : 'holding'}`}>
                <strong>
                  {order.status === "holding" ? "Holding" : "In Process"}
                </strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
}

export default OrdersStatus;
