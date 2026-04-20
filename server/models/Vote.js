const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  voterId: { type: String, required: true }, // For audit trail
  encryptedVoteChoice: String, // Optional: encrypted vote for privacy
  ipAddress: String, // For security tracking
  userAgent: String, // Browser info
  timestamp: { type: Date, default: Date.now },
  verificationCode: String, // Unique code for voter receipt
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election" }
});

// Ensure one vote per voter
VoteSchema.index({ userId: 1 }, { unique: true });
VoteSchema.index({ voterId: 1 }, { unique: true });
VoteSchema.index({ candidateId: 1 });
VoteSchema.index({ timestamp: 1 });

module.exports = mongoose.model("Vote", VoteSchema);