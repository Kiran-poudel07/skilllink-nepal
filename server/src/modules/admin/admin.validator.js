const Joi = require("joi");

exports.createAdminSchema = Joi.object({
  name: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid("admin","superadmin").optional(),
});


exports.changeUserStatusSchema = Joi.object({
  userId: Joi.string().required(),
  action: Joi.string().valid("BLOCK","UNBLOCK","DELETE").required(),
  reason: Joi.string().optional().allow("")
});

exports.userListQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(200).optional(),
  role: Joi.string().optional(),
  q: Joi.string().optional(), 
  status: Joi.string().valid("active","blocked","suspended").optional()
});

exports.gigActionSchema = Joi.object({
  gigId: Joi.string().required(),
  action: Joi.string().valid("PAUSE","UNPAUSE","CLOSE","DELETE").required(),
  reason: Joi.string().optional().allow("")
});

exports.auditQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(200).optional(),
  actor: Joi.string().optional(),
  action: Joi.string().optional()
});
