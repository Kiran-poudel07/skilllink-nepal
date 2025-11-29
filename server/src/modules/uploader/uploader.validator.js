const Joi = require("joi");

exports.profileValidation = Joi.object({
  role: Joi.string().valid("student", "employer").required(),

  
  skills: Joi.when('role', { is: 'student', then: Joi.array().items(Joi.string()).min(1).required(), otherwise: Joi.forbidden() }),
  bio: Joi.when('role', { is: 'student', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  education: Joi.when('role', { is: 'student', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  experience: Joi.when('role', { is: 'student', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  portfolioLinks: Joi.when('role', { is: 'student', then: Joi.array().items(Joi.string()).optional(), otherwise: Joi.forbidden() }),


  companyName: Joi.when('role', { is: 'employer', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  companyDescription: Joi.when('role', { is: 'employer', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  companyAddress: Joi.when('role', { is: 'employer', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  contactInfo: Joi.when('role', { is: 'employer', then: Joi.string().required(), otherwise: Joi.forbidden() }),
  category: Joi.when('role', { is: 'employer', then: Joi.string().required(), otherwise: Joi.forbidden() })
});
