const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

router.get("/:supplierId", async (req, res) => {
  try {
    const products = await Product.find({ supplier: req.params.supplierId });
    if (products.length === 0) {
      return res.status(404).json({ error: "Products not found" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving products" });
  }
});

module.exports = router;
