const express = require("express");
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { companyName, phoneNumber, representativeName, products } = req.body;
    
    const newSupplier = new Supplier({
      companyName,
      phoneNumber,
      representativeName
    });
    await newSupplier.save();
    
    const productPromises = products.map(async (product) => {
      const newProduct = new Product({
        name: product.name,
        price: product.price,
        minQuantity: product.minQuantity,
        supplier: newSupplier._id
      });
      await newProduct.save();
      return newProduct;
    });
    await Promise.all(productPromises);
    res.status(201).json({ message: "register successful", supplierId: newSupplier._id });
  } catch (error) {
    res.status(500).json({ error: "error in register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { companyName, phoneNumber, representativeName } = req.body;

    const supplier = await Supplier.findOne({
      companyName,
      phoneNumber,
      representativeName
    });

    if (!supplier) {
      return res.status(404).json({ error: "supplier doesnt exist" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res.status(500).json({ error: "error try to login" });
  }
});


router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json(suppliers);
  } catch (error) {
    res.status(500).json({ error: "error to ger suppliers" });
  }
});



module.exports = router;
