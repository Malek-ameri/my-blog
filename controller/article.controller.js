const {join} = require("path")
const sharp  = require("sharp");
const { asyncHandler } = require("../utils/asyncHandler")
const Article = require("../model/article.model");
const { multerUpload } = require("../utils/multer.config");

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

module.exports = { createArticle, uploadArticleImage }