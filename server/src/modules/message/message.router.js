const express = require("express");
const messageRouter = express.Router();
const messageCtrl = require("../message/message.controller");
const { auth } = require("../../middlewares/auth.middleware");
const { sendMessageSchema } = require("../message/message.validator");
const bodyValidator = require("../../middlewares/validator.middleware");

messageRouter.post("/", auth(), bodyValidator(sendMessageSchema), messageCtrl.sendMessage);
messageRouter.get("/:conversationId", auth(), messageCtrl.getMessages);
messageRouter.patch("/:conversationId/read", auth(), messageCtrl.markAsRead);

module.exports = messageRouter;
