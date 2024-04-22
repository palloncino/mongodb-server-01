import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose";
const router = express.Router();

// Get all users
router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users: " + error.message });
  }
});

// Edit an existing user
router.put("/edit-user", async (req, res) => {
  const { _id } = req.body; // Use _id from MongoDB

  if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send("Invalid or missing MongoDB _id.");
  }

  try {
    const update = { ...req.body };
    delete update._id; // Remove _id from update object if present

    const user = await User.findByIdAndUpdate(_id, update, { new: true });
    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user: " + error.message });
  }
});

// Delete one or more users
router.delete("/delete-users", async (req, res) => {
  // More appropriate for delete operations
  const idsToDelete = req.body.ids;
  if (!idsToDelete || !Array.isArray(idsToDelete)) {
    return res
      .status(400)
      .send("Invalid request, 'ids' must be an array of user IDs.");
  }

  try {
    const result = await User.deleteMany({ _id: { $in: idsToDelete } });
    if (result.deletedCount === 0) {
      return res.status(404).send("No users found with the given IDs.");
    }

    res.status(200).send({
      ids: idsToDelete,
      message: `Users with IDs: ${idsToDelete.join(
        ", "
      )} were successfully deleted.`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting users: " + error.message });
  }
});

export default router;
