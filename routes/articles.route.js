const express = require("express");
const router = express.Router();
const { createArticle, uploadArticleImage ,updateArticle, deleteArticle,getAllArticle,getArticle,getMyArticles} = require("../controller/article.controller");
const { protect } = require("../controller/auth.controller");
const { validator } = require("../middleware/validations/validator");
const { createArticleSchema,updateArticleSchema } = require("../middleware/validations/article.validation");


router.get("/",getAllArticle);
router.post("/", protect, uploadArticleImage, validator(createArticleSchema), createArticle);
router.get("/:id",getArticle);
router.patch("/:id",protect,uploadArticleImage,validator(updateArticleSchema),updateArticle);
router.delete("/:id",protect,deleteArticle);
router.get("/me",protect,getMyArticles);


module.exports = router;
