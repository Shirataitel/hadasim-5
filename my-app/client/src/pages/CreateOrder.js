import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; 
import "./CreateOrder.css";

const CreateOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.error("Error retrieving suppliers", err));
  }, []);

  useEffect(() => {
    if (selectedSupplier) {
      axios.get(`http://localhost:5000/api/products/${selectedSupplier}`)
        .then(res => setProducts(res.data))
        .catch(err => console.error("Error retrieving products", err));
    }
  }, [selectedSupplier]);

  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: Number(value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProducts = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));

    if (!selectedProducts.length) {
      setSuccessMessage("Select at least one product to order");      
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders", {
        supplierId: selectedSupplier,
        products: selectedProducts,
      });
      setSuccessMessage("The order has been sent to the supplier successfully!"); 
      setQuantities({});
      setProducts([])
      setSelectedSupplier(null)
    } catch (err) {
      console.error("Error sending invitation", err);
      setSuccessMessage("An error occurred while sending the invitation.");
    }
  };

  return (
    <div className="create-order-container">
      <Navbar showBack />
      <h2>Order goods from a supplier</h2>

      <label>select supplier:</label>
      <select value={selectedSupplier || ""} onChange={(e) => setSelectedSupplier(e.target.value)}>
        <option value="">--select supplier--</option>
        {suppliers.map(supplier => (
          <option key={supplier._id} value={supplier._id}>{supplier.companyName}</option>
        ))}
      </select>
      {successMessage && (
        <div className={successMessage.includes("success") ? "success-message" : "error-message"}>
          {successMessage}
        </div>
      )}
      {products.length > 0 && (
        <form onSubmit={handleSubmit}>
          <h3>Available products</h3>
          {products.map(product => (
            <div key={product._id}>
              <span>{product.name} - ₪{product.price} (minimum: {product.minQuantity})</span>
              <input
                type="number"
                min={product.minQuantity}
                placeholder="Quantity per order"
                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
              />
            </div>
          ))}
          <button className="create-btn" type="submit">Send order</button>
        </form>
      )}
    </div>
  );
};

export default CreateOrder;
