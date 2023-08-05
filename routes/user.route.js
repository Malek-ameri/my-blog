const express = require("express");
const router = express.Router();
const multer = require("multer")
const{ join } = require("path")
const { existsSync } = require("fs")


const { protect } = require("../controller/auth.controller");
const { getUser, deleteAccount, changePassword, editUserProfile,editAvatar } = require("../controller/user.controller")
const { asyncHandler } = require("../utils/asyncHandler");
const {validator} = require("../middleware/validations/validator");
const { chanegPasswordSchema , updateUserSchema} = require("../middleware/validations/user.validation");
const {uploadFile } = require("../middleware/multer")


router.get("/profile", protect, asyncHandler(getUser))
router.delete("/profile", protect, asyncHandler(deleteAccount))
router.patch("/profile",protect, validator(updateUserSchema), asyncHandler(editUserProfile))
router.put("/password", protect,validator(chanegPasswordSchema),asyncHandler(changePassword))

router.post("/avatar",protect,uploadFile.single("image"),asyncHandler(editAvatar))


module.exports = router