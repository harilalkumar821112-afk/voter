const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: String,
  party: String,
  photo: { type: String, default: "" },
  description: { type: String, default: "" },
  bio: { type: String, default: "" },
  votes: { type: Number, default: 0 },
  votePercentage: { type: Number, default: 0 },
  
  // Candidate details
  age: Number,
  education: String,
  experience: String,
  website: String,
  
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

candidateSchema.index({ name: 1 });
candidateSchema.index({ party: 1 });
candidateSchema.index({ electionId: 1 });

module.exports = mongoose.model("Candidate", candidateSchema);