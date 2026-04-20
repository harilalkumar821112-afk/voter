const mongoose = require("mongoose");

const ElectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  
  // Timing
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  
  // Status
  status: { type: String, enum: ["scheduled", "ongoing", "ended"], default: "scheduled" },
  isActive: { type: Boolean, default: false },
  
  // Election details
  totalVoters: { type: Number, default: 0 },
  totalVotesCast: { type: Number, default: 0 },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
  
  // Rules
  allowVoteChange: { type: Boolean, default: false }, // Can voters change their vote?
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ElectionSchema.index({ status: 1 });
ElectionSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model("Election", ElectionSchema);
