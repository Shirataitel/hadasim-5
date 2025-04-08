const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  minQuantity: { type: Number, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
