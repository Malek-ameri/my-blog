const { asyncHandler } = require("../utils/asyncHandler");
const Article = require("../model/article.model");
const Comment = require("../model/comment.model")
const { AppError } = require("../utils/AppError");

const createComment = asyncHandler(async (req, res, next) => {
    const { userId } = req
    const { comment, articleId } = req.body

    const findArticle = await Article.findOne({ _id: articleId });
    if (!findArticle) return next(new AppError(404, "Not found article"));

    const newComment = await Comment.create({ article: articleId, author: userId, comment })

    res.status(200).json({
        status: 'success',
        data: newComment
    })
})

const updateComment = asyncHandler(async (req, res, next) => {
    const { userId } = req
    const { id: commentId } = req.params
    const { comment } = req.body

    const findCommetn = await Comment.findOne({ _id: commentId });
    if (!findCommetn) return next(new AppError(404, "Not found comment"));

    if (userId.toString() !== findCommetn.author.toString()) {
        return next(new AppError(403, " You do not have access to update other people's comment"))
    }

    findCommetn.comment = comment
    const updateComment = await findCommetn.save({ validateBeforeSave: false })

    res.status(200).json({
        status: 'success',
        data: updateComment
    })
})

const deleteComment = asyncHandler(async (req, res, next) => {
    const { userId } = req
    const { id: commentId } = req.params

    const findCommetn = await Comment.findOne({ _id: commentId });
    if (!findCommetn) return next(new AppError(404, "Not found comment"));

    if (userId.toString() !== findCommetn.author.toString()) {
        return next(new AppError(403, " You do not have access to delet other people's comment"))
    }

    await Comment.findByIdAndDelete({ _id: commentId })

    res.status(204).json({
        status: 'success',
        data: null
    })
})


module.exports = { createComment, updateComment, deleteComment }