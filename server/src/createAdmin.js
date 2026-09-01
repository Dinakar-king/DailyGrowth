import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/daily_growth_v2");

    const email = "admin_growth@dailygrowth.com";
    const plainPassword = "Admin@123456";

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Update or insert the admin user
    const result = await User.findOneAndUpdate(
      { email },
      {
        name: "Admin Growth",
        email,
        password: hashedPassword,
        role: "admin",
        streak: 0,
      },
      { upsert: true, new: true }
    );

    console.log("-----------------------------------------");
    console.log(" Admin user created / updated cleanly!");
    console.log(" Email   :", result.email);
    console.log(" Role    :", result.role);
    console.log(" Password: Admin@123456");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (err) {
    console.error("Failed to seed admin:", err);
    process.exit(1);
  }
}

run();