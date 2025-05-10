import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import path from "path";
import multer from "multer";
import fs from "fs";

// NEW: Import mongoose and your User model
import mongoose from "mongoose";
import User from "./models/User.js";

const __dirname = path.resolve();
const app = express();
const PORT = 5000;

// NEW: Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/bizcon", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Middleware
app.use(cors());
app.use(express.json());

// Setup multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "d:/Capstone/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files from the uploads folder
app.use("/uploads", express.static("d:/Capstone/uploads"));

// UPDATED /register endpoint using mongoose instead of lowdb
app.post("/register", async (req, res) => {
  const { username, phone_number, email, password } = req.body;
  if (!username || !phone_number || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const normEmail = email.toLowerCase();
  try {
    const existingUser = await User.findOne({ email: normEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      phone_number,
      email: normEmail,
      password: hashedPassword,
      profilePic: "p1.jpg",
      posts: [],
      followers: [],
      following: []
    });
    await newUser.save();
    console.log("New user registered:", newUser);
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// UPDATED /login endpoint using mongoose
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normEmail = email.toLowerCase();
  try {
    const user = await User.findOne({ email: normEmail });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });
    const { password: _, ...userData } = user.toObject();
    res.status(200).json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
