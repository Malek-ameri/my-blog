const Joi = require('joi');

const createCommentSchema = Joi.object({
	articleId: Joi.string().length(24).required().trim(),
    comment: Joi.string().required().trim()
});

const updateCommentSchema = Joi.object({
    comment: Joi.string().required().trim().min(3).max(50)
});

module.exports = { createCommentSchema ,updateCommentSchema};