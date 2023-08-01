const joi = require("joi");

const registerSchema = joi.object({
  firstname: joi.string().required().alphanum().trim().min(3).max(30),
  lastname: joi.string().required().alphanum().trim().min(3).max(30),
  username: joi.string().required().alphanum().trim().min(3).max(30),
  email: joi.string().required().trim().email(),
  password: joi
    .string()
    .required()
    .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
    .label(
      "The password must contain at least 8 characters and at least one letter and one number"
    ),
  gender: joi.string().trim().valid("male", "female"),
});

const loginSchema = joi.object({
  username: joi.string().required().trim(),
  password: joi.string().required().trim(),
});

module.exports = { registerSchema,loginSchema };
