import bcrypt from "bcrypt";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate a token directly using process.env
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Authentication successful!", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/verify-token", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ _id: decoded.id }); // Use _id here
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Token verified successfully", user });
  } catch (err) {
    res
      .status(401)
      .json({ message: "Invalid or expired token", error: err.message });
  }
});

router.post("/signup", async (req, res) => {
  const {
    fiscalCode,
    vatNumber,
    firstName,
    lastName,
    companyName,
    address,
    email,
    phoneNumber,
    mobileNumber,
    contactPerson,
    role,
    profileImage,
    password,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with the same email" });
    }

    const newUser = new User({
      fiscalCode,
      vatNumber,
      firstName,
      lastName,
      companyName,
      address,
      email,
      phoneNumber,
      mobileNumber,
      contactPerson,
      password, // Directly pass the plaintext password for hashing in middleware
      registrationDate: new Date(),
      lastLoginDate: new Date(),
      status: "active",
      role,
      profileImage,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user: " + error.message });
  }
});

export default router;
