const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: { type: String, default: "" },
  voterId: { type: String, unique: true, sparse: true, default: null },
  isAdmin: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isEmailVerified: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false },
  votedFor: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", default: null },
  voteTime: { type: Date, default: null },
  profilePic: { type: String, default: "" },
  
  // JWT & Session
  refreshTokens: [{ type: String }],
  
  // OTP
  otp: { type: String, default: null },
  otpExpiry: { type: Date, default: null },
  otpAttempts: { type: Number, default: 0 },
  
  // Audit
  lastLogin: { type: Date, default: null },
  loginAttempts: { type: Number, default: 0 },
  isLocked: { type: Boolean, default: false },
  lockedUntil: { type: Date, default: null },
  
  notifications: {
    type: [{
      type: { type: String, default: "receipt" },
      title: String,
      message: String,
      receipt: {
        receiptNumber: String,
        voterId: String,
        candidateName: String,
        candidateParty: String,
        voteDate: Date
      },
      createdAt: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }],
    default: []
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for quick lookups
UserSchema.index({ email: 1 });
UserSchema.index({ voterId: 1 });

module.exports = mongoose.model("User", UserSchema);