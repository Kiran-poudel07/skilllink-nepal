const Joi = require("joi");

exports.createConversationSchema = Joi.object({
    userId: Joi.string().required()
});
