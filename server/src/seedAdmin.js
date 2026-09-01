import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL || "admin@dailygrowth.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log(` Admin user already exists. Role updated to admin: ${adminEmail}`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: "Platform Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      streak: 0,
    });

    console.log(" Admin account created successfully!");
    console.log(` Email: ${adminEmail}`);
    console.log(` Password: ${adminPassword}`);
    process.exit(0);
  } catch (error) {
    console.error(" Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();