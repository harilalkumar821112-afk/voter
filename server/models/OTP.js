const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const OTPSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true },
  otp: { type: String, required: true },
  type: { type: String, enum: ["email_verification", "password_reset", "login"], default: "email_verification" },
  
  // Expiry and attempts
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  isUsed: { type: Boolean, default: false },
  
  // Verification code
  verificationToken: { type: String, default: () => uuidv4() },
  
  createdAt: { type: Date, default: Date.now, expires: 600 } // Auto-delete after 10 minutes
});

OTPSchema.index({ email: 1 });
OTPSchema.index({ verificationToken: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OTP", OTPSchema);
