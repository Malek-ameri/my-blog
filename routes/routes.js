const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const userRout = require("./user.route");
const articleRoute = require ("./articles.route")
const commentRoute = require ("./comment.route")

router.use("/auth", authRoute);
router.use("/users", userRout);
router.use("/articles", articleRoute);
router.use("/comments", commentRoute);

module.exports = router;
