const Joi = require("joi");

exports.createNotificationSchema = Joi.object({
  recipient: Joi.string().required(),
  type: Joi.string()
    .valid("application_submitted", "application_status_changed", "gig_update", "system")
    .required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  gig: Joi.string().optional(),
});

exports.markReadSchema = Joi.object({
  id: Joi.string().required(),
});
