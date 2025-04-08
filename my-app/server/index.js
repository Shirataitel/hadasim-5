const express = require("express");
const connectDB = require("./db");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


// API queries
const supplierRoutes = require("./routes/suppliers");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");

app.use("/api/suppliers", supplierRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes)

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
