const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  gig: { type: mongoose.Types.ObjectId, ref: "Gig", required: true },
  proposalMessage: { type: String },
  expectedRate: { type: Number },
  resume: {
    original: { type: String },
    optimized: { type: String }
  },
  coverLetter: { type: String },
  estimatedDuration: { type: String },
  // portfolioLink: { type: String },
  status: { type: String, enum: ["pending","accepted","rejected","completed"], default: "pending" },
  appliedAt: { type: Date, default: Date.now },
  employerRead: { type: Boolean, default: false },
  studentRead: { type: Boolean, default: true }
}, { timestamps: true });

const ApplicationModel = mongoose.model("Application", applicationSchema);
module.exports = ApplicationModel
