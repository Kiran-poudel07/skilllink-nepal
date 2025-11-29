const conversationSvc = require("../conversation/conversation.service");

class ConversationController {
    async createConversation(req, res, next) {
        try {
            const user1 = req.loggedInUser._id;
            const { userId } = req.body;
            const conversation = await conversationSvc.createOrGetConversation(user1, userId);
            res.json({ status: "success", data: conversation });
        } catch (err) {
            next(err);
        }
    }

    async getUserConversations(req, res, next) {
        try {
            const conversations = await conversationSvc.getUserConversations(req.loggedInUser._id);
            res.json({ status: "success", data: conversations });
        } catch (err) {
            next(err);
        }
    }

    async markConversationRead(req, res, next) {
        try {
            const conversation = await conversationSvc.markConversationRead(req.params.conversationId, req.loggedInUser._id);
            res.json({ status: "success", data: conversation });
        } catch (err) {
            next(err);
        }
    }
}

const conversationCtrl = new ConversationController();


module.exports = conversationCtrl
