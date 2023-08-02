const express = require("express");
const router = express.Router();
const { protect } = require("../controller/auth.controller");
const { getUser, deleteAccount, changePassword, editUserProfile } = require("../controller/user.controller")
const { asyncHandler } = require("../utils/asyncHandler");
const {validator} = require("../middleware/validations/validator");
const { chanegPasswordSchema , updateUserSchema} = require("../middleware/validations/user.validation");


router.get("/profile", protect, asyncHandler(getUser))
router.delete("/profile", protect, asyncHandler(deleteAccount))
router.patch("/profile",protect, validator(updateUserSchema), asyncHandler(editUserProfile))
router.put("/password", protect,validator(chanegPasswordSchema),asyncHandler(changePassword))

module.exports = router