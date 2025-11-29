const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: String, default: "" },
    unreadCounts: { type: Map, of: Number, default: {} } // userId -> unread count
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, updatedAt: -1 });

const ConversationModel = mongoose.model("Conversation", conversationSchema);
module.exports = ConversationModel;
