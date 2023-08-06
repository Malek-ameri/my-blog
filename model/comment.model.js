const { Schema, model, Types } = require('mongoose');

const CommentSchema = new Schema({
	article: {
		type: Types.ObjectId,
		ref: 'Article',
		required: true
	},
	author: {
		type: Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: true
	},
	
},{timestamps:true});

module.exports = model('Comment', CommentSchema);