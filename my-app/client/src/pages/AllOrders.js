import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; 
import "./AllOrders.css";

function AllOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/all"); 
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching all orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="all-orders-container">
      <Navbar showBack />
      <h2 className="all-orders-title">All Orders</h2>
      {orders.length === 0 ? (
        <p className="no-orders-msg">No orders available</p>
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
              <td>{order.supplierId.companyName}</td> 
              <td>
                {order.products.map((product) => (
                  <div key={product.productId} className="product-item">
                    {product.productId.name} (x{product.quantity})
                  </div>
                ))}
              </td>
              <td className={`order-status ${order.status === 'completed' ? 'completed' : order.status === 'in-process' ? 'in-process' : 'holding'}`}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
        )}
    </div>
  
  );
}

export default AllOrders;
