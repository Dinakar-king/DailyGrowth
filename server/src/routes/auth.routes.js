import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET || "secretkey123",
    { expiresIn: "7d" }
  );
};

// Candidate & Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || "user",
      streak: user.streak || 0,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin / Faculty Instructor Registration
router.post("/admin-register", async (req, res) => {
  try {
    const { name, email, password, subjectDomain, staffKey } = req.body;

    // Optional Master Security Key Check (default: 'TEACHER2026')
    const REQUIRED_KEY = process.env.ADMIN_INVITE_KEY || "TEACHER2026";
    if (staffKey && staffKey !== REQUIRED_KEY) {
      return res.status(403).json({ message: "Invalid Staff Access Passkey." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({
      name: `${name} (${subjectDomain || "Faculty"})`,
      email,
      password: hashedPassword,
      role: "admin",
      streak: 0,
    });

    const token = generateToken(newAdmin);
    res.status(201).json({
      _id: newAdmin._id,
      name: newAdmin.name,
      email: newAdmin.email,
      role: "admin",
      streak: 0,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;