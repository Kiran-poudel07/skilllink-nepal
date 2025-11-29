const ConversationModel = require("../conversation/conversation.model");

class ConversationService {
    async createOrGetConversation(user1, user2) {
        let conversation = await ConversationModel.findOne({
            participants: { $all: [user1, user2] }
        });

        if (!conversation) {
            conversation = new ConversationModel({
                participants: [user1, user2],
                unreadCounts: { [user2]: 0 }
            });
            await conversation.save();
        }

        return conversation;
    }

    async getUserConversations(userId) {
        return ConversationModel.find({ participants: userId })
            .populate("participants", "name role image")
            .sort({ updatedAt: -1 });
    }

    async markConversationRead(conversationId, userId) {
        const conversation = await ConversationModel.findById(conversationId);
        if (!conversation) throw { statusCode: 404, message: "Conversation not found" };
        conversation.unreadCounts.set(userId.toString(), 0);
        await conversation.save();
        return conversation;
    }
}
const conversationSvc = new ConversationService();
module.exports = conversationSvc
