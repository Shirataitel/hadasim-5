import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import "./Register.css";

function Register() {
  const [supplier, setSupplier] = useState({
    companyName: "",
    phoneNumber: "",
    representativeName: "",
  });

  const [error, setError] = useState("");
  const [products, setProducts] = useState([{ name: "", price: "", minQuantity: "" }]);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/suppliers", { 
        ...supplier,
        products,
      });
      console.log(response.data);
      const { supplierId } = response.data;
      navigate("/orders",{ state: { supplierId } });
    } catch (error) {
      console.error("Error registering supplier:", error);
      setError("Error, try again");
    }
  };

  const addProduct = () => {
    setProducts([...products, { name: "", price: "", minQuantity: "" }]);
  };

  const handleProductChange = (e, index) => {
    const updatedProducts = [...products];
    updatedProducts[index][e.target.name] = e.target.value;
    setProducts(updatedProducts);
  };

  return (
    <div className="register-container">
    <Navbar/>
      <h2 className="register-title">Register Supplier</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} className="input-field" required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} className="input-field" required />
        <input type="text" name="representativeName" placeholder="Representative Name" onChange={handleChange} className="input-field" required />
        <h3 className="products-title">Products</h3>
        {products.map((product, index) => (
          <div key={index} className="product-inputs">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleProductChange(e, index)}
              className="input-field"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              onChange={(e) => handleProductChange(e, index)}
              className="input-field"
              required
            />
            <input
              type="number"
              name="minQuantity"
              placeholder="Minimum Quantity"
              value={product.minQuantity}
              onChange={(e) => handleProductChange(e, index)}
              className="input-field"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addProduct} className="add-product-button">
          Add Product
        </button>

        <button type="submit" className="register-button">Register</button>
      </form>
      {error && <p className="owner-login-error">{error}</p>}
    </div>
  );
}

export default Register;