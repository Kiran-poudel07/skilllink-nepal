const messageSvc = require("../message/message.service");

class MessageController {
    async sendMessage(req, res, next) {
        try {
            const { receiverId, text, conversationId } = req.body;
            const message = await messageSvc.sendMessage({
                sender: req.loggedInUser._id,
                receiver: receiverId,
                text,
                conversationId
            });
            res.json({ status: "success", data: message });
        } catch (err) {
            next(err);
        }
    }

    async getMessages(req, res, next) {
        try {
            const messages = await messageSvc.getMessages(req.params.conversationId, req.loggedInUser._id);
            res.json({ status: "success", data: messages });
        } catch (err) {
            next(err);
        }
    }

    async markAsRead(req, res, next) {
        try {
            const result = await messageSvc.markAsRead(req.params.conversationId, req.loggedInUser._id);
            res.json({ status: "success", data: result });
        } catch (err) {
            next(err);
        }
    }
}
const messageCtrl = new MessageController();


module.exports = messageCtrl
