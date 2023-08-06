const Joi = require('joi');

const createArticleSchema = Joi.object({
	title: Joi.string().min(3).max(40).required().trim(),
	content: Joi.string().required().trim()
});

const updateArticleSchema = Joi.object({
	title: Joi.string().min(3).max(40).trim(),
	content: Joi.string().trim()
});

module.exports = { createArticleSchema, updateArticleSchema };