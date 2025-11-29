const MessageModel = require("../message/message.model");
const ConversationModel = require("../conversation/conversation.model");
const { emitMessage } = require("../../config/socket");

class MessageService {
    async sendMessage({ sender, receiver, text, attachments = [], conversationId = null }) {
        let conversation;

        if (conversationId) {
            conversation = await ConversationModel.findById(conversationId);
            if (!conversation) throw { statusCode: 404, message: "Conversation not found" };
        } else {
            conversation = await ConversationModel.findOne({
                participants: { $all: [sender, receiver] }
            });
            if (!conversation) {
                conversation = new ConversationModel({
                    participants: [sender, receiver],
                    unreadCounts: { [receiver]: 1 }
                });
                await conversation.save();
            }
        }

        const message = new MessageModel({
            conversation: conversation._id,
            sender,
            receiver,
            text,
            attachments
        });

        await message.save();

        conversation.lastMessage = text || attachments[0] || "";
        conversation.unreadCounts.set(receiver.toString(), (conversation.unreadCounts.get(receiver.toString()) || 0) + 1);
        await conversation.save();

        emitMessage(receiver.toString(), message);

        return message;
    }

    async getMessages(conversationId, userId) {
        const conversation = await ConversationModel.findById(conversationId);
        if (!conversation) throw { statusCode: 404, message: "Conversation not found" };
        if (!conversation.participants.includes(userId)) throw { statusCode: 403, message: "Not authorized" };

        return MessageModel.find({ conversation: conversationId }).sort({ createdAt: 1 });
    }

    async markAsRead(conversationId, userId) {
        const messages = await MessageModel.updateMany(
            { conversation: conversationId, receiver: userId, isRead: false },
            { $set: { isRead: true } }
        );

        const conversation = await ConversationModel.findById(conversationId);
        conversation.unreadCounts.set(userId.toString(), 0);
        await conversation.save();

        return messages;
    }
}

const messageSvc = new MessageService();


module.exports = messageSvc
