const express = require("express");
const router = express.Router();
const {createArticle, uploadArticleImage} = require("../controller/article.controller");
const { protect } = require("../controller/auth.controller");
const {validator} = require("../middleware/validations/validator");
const { createArticleSchema } = require("../middleware/validations/article.validation");


router.post("/",protect,uploadArticleImage, validator(createArticleSchema),createArticle);


module.exports = router;
