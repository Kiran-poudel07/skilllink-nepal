const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "application_submitted",
        "application_status_changed",
        "gig_update",
        "system",
        "PAYMENT_SUCCESS",
        "PAYMENT_RECEIVED",
        "review_received",
        "admin_action",
        "gig_moderation",

     
        "USER_BLOCKED",
        "USER_UNBLOCKED",
        "USER_DELETED",
        "USER_RESTORED",
        "USER_ACTIVATED",
        "USER_DEACTIVATED"
      ],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },
    gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gig" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);
module.exports = NotificationModel;
