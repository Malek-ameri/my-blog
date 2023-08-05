const multer = require("multer");
const { AppError } = require("../utils/AppError");
const { existsSync, unlinkSync } = require("fs")
const { join } = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/image/profile_image")
    },
    filename: function (req, file, cb) {

        if (file.mimetype.startsWith("image/")) {
            const checkExist = existsSync(join(__dirname, `../public/image/profile_image/${req.userId}.PNG`))
            if (checkExist) {
                unlinkSync(join(__dirname, `../public/image/profile_image/${req.userId}.PNG`))
            }
            const fileName = `${req.userId}.PNG`
            req.avatarName = `${req.userId}.PNG`
            cb(null, fileName)
        } else {
            cb(new AppError(400, "The file format must be a image"))
        }

    }
})




const uploadFile = multer({ storage });

module.exports = { uploadFile }