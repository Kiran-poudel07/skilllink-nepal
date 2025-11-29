const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    attachments: [{ type: String }],
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;