const { join } = require("path");
const { access, unlink, constants } = require("fs/promises")
const sharp = require("sharp");
const { asyncHandler } = require("../utils/asyncHandler")
const Article = require("../model/article.model");
const { multerUpload } = require("../utils/multer.config");
const { AppError } = require("../utils/AppError");

const uploadArticleImage = multerUpload.single('image');

const editArticleImage = async (articleId, file = null) => {
	if (!file) return file;

	const articleFilename = `article-${articleId}-${Date.now()}.jpeg`;

	await sharp(file.buffer)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(
			join(__dirname, `../public/image/post_image/${articleFilename}`)
		);

	return articleFilename;
};
//  ______________

const createArticle = asyncHandler(async (req, res, next) => {

	const { userId } = req;
	const { title, content } = req.body;

	const article = await Article.create({ title, content, author: userId });

	const articleImage = await editArticleImage(article.id, req.file)
	if (!!articleImage) {
		article.image = articleImage
		await article.save({ validateBeforeSave: false })
	}

	res.status(201).json({
		status: 'success',
		data: { article }
	});
});

const updateArticle = asyncHandler(async (req, res, next) => {
	const { userId } = req;
	const { id: articleId } = req.params

	const article = await Article.findById({ _id: articleId });
	if (!article) return next(new AppError(404, "Not found article"))

	if (userId.toString() !== article.author.toString()) {
		return next(new AppError("403", " You do not have access to edit other people's articles"))
	}

	const { title = null, content = null } = req.body;

	const image = await editArticleImage(articleId, req.file);

	if (!!image && article.image !== 'article-default-image.jpeg') {
		await access(
			join(__dirname, `../public/image/post_image/${article.image}`),
			constants.F_OK
		);
		await unlink(
			join(__dirname, `../public/image/post_image/${article.image}`)
		);
	}

	article.image = image ?? article.image;
	article.title = title ?? article.title;
	article.content = content ?? article.content;

	await article.save({ validateModifiedOnly: true });

	res.status(202).json({
		status: 'success',
		data: { article }
	});
});

const deleteArticle = asyncHandler(async (req, res, next) => {
	const { userId } = req;
	const { id: articleId } = req.params

	const article = await Article.findById({ _id: articleId })
	if (!article) return next(new AppError(404, "Not found article"))

	if (userId.toString() !== article.author.toString()) {
		return next(new AppError("403", " You do not have access to delete other people's articles"))
	}

	const deletArticle = await Article.findOneAndDelete(articleId)
	if (deletArticle.image !== 'article-default-image.jpeg') {
		await access(
			join(__dirname, `../public/image/post_image/${deletArticle.image}`),
			constants.F_OK
		);
		await unlink(
			join(__dirname, `../public/image/post_image/${deletArticle.image}`)
		);
	}

	res.status(204).json({
		status: 'success',
		data: null
	});

});

const getAllArticle = asyncHandler(async (req, res, next) => {
	const articles = await Article.find().populate("author")
	res.status(200).json({
		status: 'success',
		data: articles
	});
});

const getArticle = asyncHandler(async (req, res, next) => {

	const { id: articleId } = req.params

	const article = await Article.findById({ _id: articleId }).populate("author")
	if (!article) return next(new AppError(404, "Not found article"))

	res.status(200).json({
		status: 'success',
		data: article
	});
});

const getMyArticles = asyncHandler(async (req, res, next) => {
	const { userId } = req;
	const userArticles = await Article.find({ author: userId })
	res.status(200).json({
		status: 'success',
		data: userArticles
	});

})


module.exports = { createArticle, uploadArticleImage, updateArticle, deleteArticle, getAllArticle, getArticle, getMyArticles }