const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  budget: { type: Number, required: true },
  duration: { type: String, required: true },
  requiredSkills: [{ type: String }],
  attachments: [{ type: Object }], 
  employer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: Object.values(Status), default: Status.INACTIVE },
  applicationsCount: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false } 
}, { timestamps: true });



const GigModel = mongoose.model("Gig", gigSchema);
module.exports = GigModel;
