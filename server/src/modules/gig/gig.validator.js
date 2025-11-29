const Joi = require("joi");
const { Status } = require("../../config/constant");

exports.createGigDTO = Joi.object({
  title: Joi.string().min(5).max(100).required(),
  description: Joi.string().optional(),
  category: Joi.string().required(),
  budget: Joi.number().min(0).required(),
  duration: Joi.string().required(),
  requiredSkills: Joi.array().items(Joi.string()).optional(),
  attachments: Joi.array().items(
  Joi.object({
    publicId: Joi.string().optional(),
    url: Joi.string().optional(),
    optimizedUrl: Joi.string().optional()
  })
).optional(),

});

exports.updateGigDTO = Joi.object({
  title: Joi.string().min(5).max(100).optional(),
  description: Joi.string().optional(),
  category: Joi.string().optional(),
  budget: Joi.number().min(0).optional(),
  duration: Joi.string().optional(),
  status: Joi.string().valid(...Object.values(Status)).optional(),
  requiredSkills: Joi.array().items(Joi.string()).optional(),
  attachments:Joi.object({
      publicId: Joi.string().optional(),
      url: Joi.string().optional(),
      optimizedUrl: Joi.string().optional()
    }).optional(),
});
