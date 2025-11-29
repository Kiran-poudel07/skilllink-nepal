const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, required: true, ref: "User", index: true },
    accessToken: { actual: String, masked: String },
    refreshToken: { actual: String, masked: String },
    userSessionData: String,
    expiresAt: { type: Date, default: () => Date.now() + 7 * 24 * 60 * 60 * 1000 }, // auto-expiry in 7 days
  },
  { timestamps: true, autoCreate: true, autoIndex: true }
);

const SessionModel = mongoose.model("UserSession", SessionSchema);
module.exports = SessionModel;
