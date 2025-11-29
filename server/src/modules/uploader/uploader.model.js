const mongoose = require("mongoose");

const UploaderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  role: { type: String, enum: ["student", "employer"], required: true },


  skills: { type: [String], required: function() { return this.role === "student"; } },
  bio: { type: String, required: function() { return this.role === "student"; } },
  education: { type: String, required: function() { return this.role === "student"; } },
  experience: { type: String, required: function() { return this.role === "student"; } },
  portfolioLinks: { type: [String], required: false },
  avatar: {
    original: { type: String, required: function() { return this.role === "student"; } },
    optimized: { type: String, required: function() { return this.role === "student"; } }
  },
  resume: {
    original: { type: String, required: function() { return this.role === "student"; } },
    optimized: { type: String, required: function() { return this.role === "student"; } }
  },

 
  companyName: { type: String, required: function() { return this.role === "employer"; } },
  companyDescription: { type: String, required: function() { return this.role === "employer"; } },
  companyAddress: { type: String, required: function() { return this.role === "employer"; } },
  contactInfo: { type: String, required: function() { return this.role === "employer"; } },
  companyLogo: {
    original: { type: String, required: function() { return this.role === "employer"; } },
    optimized: { type: String, required: function() { return this.role === "employer"; } }
  },
  companyDocs: {
    original: { type: String, required: false },
    optimized: { type: String, required: false }
  },
  category: { type: String, required: false, default: null },

}, { timestamps: true,autoCreate: true, autoIndex:true });
const UploaderModel = mongoose.model("Uploader", UploaderSchema); 
module.exports =UploaderModel
