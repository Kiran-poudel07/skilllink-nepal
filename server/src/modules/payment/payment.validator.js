const Joi = require("joi");

const initiateSchema = Joi.object({
  gigId: Joi.string().required(),
  applicationId: Joi.string().required(),
  amount: Joi.number().positive().required()
});

const verifySchema = Joi.object({
  pidx: Joi.string().required()
});

const adminGetPaymentSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(200).optional(),
  status: Joi.string().valid("PENDING", "SUCCESS", "FAILED").optional(),
  q: Joi.string().optional()
});

module.exports = { initiateSchema, verifySchema, adminGetPaymentSchema };

