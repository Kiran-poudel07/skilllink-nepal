const Joi = require("joi");

exports.createApplicationDTO = Joi.object({
  gig: Joi.string().required(),
  proposalMessage: Joi.string().max(1000).optional(),
  expectedRate: Joi.number().min(0).optional(),
  coverLetter: Joi.string().max(2000).optional(),
  estimatedDuration: Joi.string().max(50).optional(),
  // portfolioLink: Joi.string().uri().optional()
});

exports.updateApplicationStatusDTO = Joi.object({
  status: Joi.string().valid("pending","accepted","rejected","completed").required()
});
