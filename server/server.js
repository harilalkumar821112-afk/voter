const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

// middleware
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ DATABASE CONNECT — cached for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn("⚠️  MONGO_URI not found");
    return;
  }
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("✅ MongoDB Atlas Connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    isConnected = false;
  }
};

connectDB();

// DB middleware for API routes
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed", error: err.message });
  }
});

// API routes
app.use("/api", userRoutes);
app.use("/api", candidateRoutes);
app.use("/api", voteRoutes);

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running", dbConnected: isConnected });
});

app.get("/", (req, res) => {
  res.json({ message: "✅ Voting API Running" });
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

module.exports = app;
