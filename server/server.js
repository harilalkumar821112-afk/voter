const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

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

// database
mongoose.connect("mongodb://127.0.0.1:27017/votingDB")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// test route
app.get("/",(req,res)=>{
res.send("Voting API Running");
});

// server start
app.listen(5000,()=>{
console.log("Server running on port 5000");
});