const express = require("express");
const router = express.Router();
const {validator} = require('../middleware/validations/validator');
const {createCommentSchema,updateCommentSchema} =require("../middleware/validations/comment.validation")
const {createComment,updateComment, deleteComment} = require("../controller/comment.controller");
const { protect } = require("../controller/auth.controller");

router.post("/", protect,validator(createCommentSchema),createComment);
router.patch("/:id", protect,validator(updateCommentSchema),updateComment);
router.delete("/:id", protect,deleteComment);





module.exports = router;