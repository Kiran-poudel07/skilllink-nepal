const Joi = require("joi");

const userRegisterDTO = Joi.object({
  name: Joi.string().min(2).max(50).trim().required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,25}$"))
    .required()
    .messages({
      "string.pattern.base": "Password must contain uppercase, lowercase, number & special char (8–25 chars)"
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
  role: Joi.string().valid("student", "employer").default("student"),
  age: Joi.number().min(16).max(100).required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  dob: Joi.date().less("now").optional(),
});

const loginDTO = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

module.exports = { userRegisterDTO, loginDTO };
