const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true }, // "vote_cast", "login", "otp_verify", "password_change", etc.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  voterId: { type: String }, // For audit trail anonymity
  email: { type: String },
  
  // Vote details
  voteDetails: {
    candidateId: mongoose.Schema.Types.ObjectId,
    candidateName: String,
    electionId: mongoose.Schema.Types.ObjectId
  },
  
  // Security details
  ipAddress: String,
  userAgent: String,
  deviceInfo: String,
  
  // Status
  status: { type: String, enum: ["success", "failed", "attempted"], default: "success" },
  reason: String, // Failure reason
  
  // Metadata
  metadata: mongoose.Schema.Types.Mixed, // Any additional data
  
  timestamp: { type: Date, default: Date.now },
  
  // Retention
  archived: { type: Boolean, default: false },
  archivedAt: Date
});

AuditLogSchema.index({ action: 1 });
AuditLogSchema.index({ userId: 1 });
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ voterId: 1 });

module.exports = mongoose.model("AuditLog", AuditLogSchema);
