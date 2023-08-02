const joi = require("joi");

const chanegPasswordSchema = joi.object({

    newPassword: joi
        .string()
        .required()
        .pattern(new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/))
        .label(
            "The new password must contain at least 8 characters and at least one letter and one number"
        ).trim(),
    oldPassword: joi.string().required().trim(),

});

const updateUserSchema = joi.object({
    firstname: joi.string().alphanum().trim().min(3).max(30),
    lastname: joi.string().alphanum().trim().min(3).max(30),
    username: joi.string().alphanum().trim().min(3).max(30),
    email: joi.string().trim().email(),
    gender: joi.string().trim().valid("male", "female"),
});


module.exports = { chanegPasswordSchema,updateUserSchema };