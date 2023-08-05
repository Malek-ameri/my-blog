const Joi = require('joi');

const createArticleSchema = Joi.object({
	title: Joi.string().min(3).max(40).required().trim(),
	content: Joi.string().required().trim()
});

module.exports = { createArticleSchema };