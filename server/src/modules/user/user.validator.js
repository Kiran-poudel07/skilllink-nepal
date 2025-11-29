const Joi = require("joi");

exports.updateProfileValidation = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().min(16).max(100).optional(),
  dob: Joi.date().iso().less('now').optional(),
  role:Joi.string().optional(),
  gender: Joi.string().valid('male','female','other').optional(),
  image: Joi.object({
    publicId: Joi.string().optional(),
    url: Joi.string().optional(),
    optimizedUrl: Joi.string().optional()
  }).optional()
});
exports.updateUserActionSchema = Joi.object({
  userId: Joi.string().required(),
  action: Joi.string()
    .valid("BLOCK", "UNBLOCK", "DELETE", "RESTORE", "DEACTIVATE", "ACTIVATE")
    .required(),
  reason: Joi.string().allow("", null)
});
