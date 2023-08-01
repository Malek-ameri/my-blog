const express = require("express");
const router = express.Router();
const {validator} = require('../middleware/validations/validator');
const { registerSchema, loginSchema } = require("../middleware/validations/auth.validation");
const { asyncHandler } = require("../utils/asyncHandler");
const { createUser, userLogin, generateToken,protect,logout } = require("../controller/auth.controller");

router.post("/register",validator(registerSchema),asyncHandler(createUser));
router.post("/login",validator(loginSchema),asyncHandler(userLogin));
router.post('/token',asyncHandler(generateToken));
router.post('/logout',protect,logout);



module.exports = router;
