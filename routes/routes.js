const express = require("express");
const router = express.Router();
const authRoute = require("./auth.route");
const userRout = require("./user.route");

router.use("/auth", authRoute);
router.use("/users", userRout);

module.exports = router;
