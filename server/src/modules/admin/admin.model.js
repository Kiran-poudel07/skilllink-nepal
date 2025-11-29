const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  actor: { type: mongoose.Types.ObjectId, ref: "User", required: true }, 
  action: { type: String, required: true }, 
  targetType: { type: String, enum: ["User","Gig","Application","Payment","Review","System"], required: true },
  targetId: { type: mongoose.Types.ObjectId, required: false },
  details: { type: Object, default: {} }, 
  ip: { type: String, default: null }
}, { timestamps: true,autoCreate:true,autoIndex:true });
const AdminModel = mongoose.model("AdminLog", adminLogSchema);
module.exports = AdminModel
