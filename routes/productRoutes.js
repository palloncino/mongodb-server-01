import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";
const router = express.Router();

// Get all products
router.get("/get-products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products: " + error.message });
  }
});

// Create a new product
router.post("/create-product", async (req, res) => {
  const product = new Product({
    ...req.body,
    dateCreated: new Date(),
    dateLastUpdate: new Date(),
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating product: " + error.message });
  }
});

// Edit an existing product
router.put("/edit-product", async (req, res) => {
  const { _id } = req.body; // Use _id from MongoDB

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send("Invalid or missing MongoDB _id.");
  }

  try {
    const update = { ...req.body };
    delete update._id; // Remove _id from update object if present

    const product = await Product.findByIdAndUpdate(_id, update, { new: true });
    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(500)
      .json({ message: "Error updating product: " + error.message });
  }
});

// Delete one or more products
router.delete("/delete-products", async (req, res) => {
  // More appropriate for delete operations
  const idsToDelete = req.body.ids;
  if (!idsToDelete || !Array.isArray(idsToDelete)) {
    return res
      .status(400)
      .send("Invalid request, 'ids' must be an array of product IDs.");
  }

  try {
    const result = await Product.deleteMany({ _id: { $in: idsToDelete } }); // Changed to _id from id
    if (result.deletedCount === 0) {
      return res.status(404).send("No products found with the given IDs.");
    }

    res.status(200).send({
      ids: idsToDelete,
      message: `Products with IDs: ${idsToDelete.join(
        ", "
      )} were successfully deleted.`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting products: " + error.message });
  }
});

export default router;
