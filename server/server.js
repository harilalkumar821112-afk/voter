const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api", userRoutes);
app.use("/api", candidateRoutes);
app.use("/api", voteRoutes);

// ✅ DATABASE CONNECT
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("Missing MONGO_URI in .env file");
  process.exit(1);
}

mongoose.connect(mongoUri)
.then(()=>console.log("MongoDB Atlas Connected"))
.catch(err=>console.log("MongoDB connection failed:", err));

// test route
app.get("/",(req,res)=>{
  res.send("Voting API Running");
});

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
});