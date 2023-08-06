const { Schema, model, Types } = require('mongoose');

const ArticleSchema = new Schema({
	author: {
		type: Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true
	},
	content: {
		type: String,
		required: true
	},
	image: {
		type: String,
		default: 'article-default-image.jpeg'
	}
},{timestamps:true});

module.exports = model('Article', ArticleSchema);