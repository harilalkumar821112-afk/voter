const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  voterId:String,
  candidateId:String,
  timestamp: { type: Date, default: Date.now }
});

// Ensure one vote per voter
VoteSchema.index({ voterId: 1 }, { unique: true });

module.exports = mongoose.model("Vote",VoteSchema);