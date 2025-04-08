const mongoose = require("mongoose");

const SupplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  representativeName: { type: String, required: true },
});

module.exports = mongoose.model("Supplier", SupplierSchema);
