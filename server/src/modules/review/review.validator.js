const Joi = require("joi");

exports.createReviewSchema = Joi.object({
  applicationId: Joi.string().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  title: Joi.string().max(150).optional().allow(""),
  comment: Joi.string().max(2000).optional().allow(""),
  anonymous: Joi.boolean().optional()
});

exports.deleteReviewSchema = Joi.object({
  id: Joi.string().required()
});

exports.getReviewsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  rating: Joi.number().integer().valid(1, 2, 3, 4, 5).optional(),
  sort: Joi.string().valid("newest", "oldest", "high", "low").optional(),
  search: Joi.string().allow("").optional()
});
