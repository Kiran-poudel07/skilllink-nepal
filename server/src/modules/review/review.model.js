const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    reviewee: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    gig: { type: mongoose.Types.ObjectId, ref: "Gig", required: true },
    application: { type: mongoose.Types.ObjectId, ref: "Application", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, default: "" },
    comment: { type: String, default: "" },
    anonymous: { type: Boolean, default: false },
    status: { type: String, enum: ["VISIBLE", "HIDDEN"], default: "VISIBLE" },
    reply: {
      author: { type: mongoose.Types.ObjectId, ref: "User" },
      text: { type: String }
    }
  },
  { timestamps: true }
);


reviewSchema.index({ reviewer: 1, application: 1 }, { unique: true });
const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = ReviewModel
