const express = require("express");
const conversationRouter = express.Router();
const conversationCtrl = require("../conversation/conversation.controller");
const { auth } = require("../../middlewares/auth.middleware");
const { createConversationSchema } = require("../conversation/conversation.validator");
const bodyValidator = require("../../middlewares/validator.middleware");

conversationRouter.post("/create", auth(), bodyValidator(createConversationSchema), conversationCtrl.createConversation);
conversationRouter.get("/get", auth(), conversationCtrl.getUserConversations);
conversationRouter.patch("/:conversationId/read", auth(), conversationCtrl.markConversationRead);

module.exports = conversationRouter;
