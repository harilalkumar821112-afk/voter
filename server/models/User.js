const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String,
  voterId:{ type:String, default: "" },
  isAdmin:{ type:Boolean, default:false },
  isVerified: { type: Boolean, default: false },
  hasVoted: { type: Boolean, default: false },
  profilePic: { type: String, default: "" },
  notifications: {
    type:[{
      type:{ type:String, default:"receipt" },
      title:String,
      message:String,
      receipt:{
        receiptNumber:String,
        voterId:String,
        candidateName:String,
        candidateParty:String,
        voteDate:Date
      },
      createdAt:{ type:Date, default: Date.now },
      read:{ type:Boolean, default:false }
    }],
    default: []
  }
});

module.exports = mongoose.model("User",UserSchema);