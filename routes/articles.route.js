const express = require("express");
const router = express.Router();
const {createArticle} = require("../controller/article.controller");
const { protect } = require("../controller/auth.controller");
const {validator} = require("../middleware/validations/validator")


router.post("/",protect, validator(),createArticle);


module.exports = router;
