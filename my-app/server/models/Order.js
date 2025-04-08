const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: { type: String, enum: ["holding", "in-process", "completed"], default: "holding" },
  notificationSeen: { type: Boolean, default: false } 
});

module.exports = mongoose.model("Order", OrderSchema);
