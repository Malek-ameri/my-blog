const express = require("express");
const router = express.Router();

const { protect } = require("../controller/auth.controller");
const { getUser, deleteAccount, changePassword, editUserProfile,uploadUserAvatar} = require("../controller/user.controller")
const { asyncHandler } = require("../utils/asyncHandler");
const {validator} = require("../middleware/validations/validator");
const { chanegPasswordSchema , updateUserSchema} = require("../middleware/validations/user.validation");


router.get("/profile", protect, asyncHandler(getUser))
router.patch("/profile",protect,uploadUserAvatar,validator(updateUserSchema),asyncHandler(editUserProfile))
router.delete("/profile", protect, asyncHandler(deleteAccount))
router.put("/password", protect,validator(chanegPasswordSchema),asyncHandler(changePassword))



module.exports = router