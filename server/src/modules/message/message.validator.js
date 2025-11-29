const Joi = require("joi");

exports.sendMessageSchema = Joi.object({
    conversationId: Joi.string().optional(), 
    receiverId: Joi.string().required(),
    text: Joi.string().allow("").optional(),
    attachments: Joi.array().items(Joi.string()).optional()
});
