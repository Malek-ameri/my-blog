const { access, unlink,constants } = require("fs/promises")
const { join } = require("path")
const sharp = require('sharp')
const User = require("../model/user.model")
const redisClient = require("../database/redis.connection")
const { comparePasssword, hashPasssword } = require("../utils/hash")
const { AppError } = require("../utils/AppError")
const { multerUpload } = require('../utils/multer.config');




const uploadUserAvatar = multerUpload.single('avatar');

const resizeUserAvatar = async (userId, file = null) => {
	if (!file) return file;

	const userAvatarFilename = `users-${userId}-${Date.now()}.jpeg`;

	await sharp(file.buffer)
		.toFormat('jpeg')
		.jpeg({ quality: 90 })
		.toFile(
			join(__dirname, `../public/image/profile_image/${userAvatarFilename}`)
		);

	return userAvatarFilename;
};

const editUserProfile = async (req, res, next) => {
	const { userId } = req;

	const { username = null, email = null, firstname = null, lastname = null, gender = null,
	} = req.body;

	const user = await User.findById(userId);

	const duplicateUser = await User.findOne({ username });
	if (!!duplicateUser && duplicateUser.username !== user.username) {
		return next(
			new AppError(409, `username: ${username} already exist, try again`)
		);
	}

	const duplicateEmail = await User.findOne({ email });
	if (!!duplicateEmail && duplicateEmail.email !== user.email) {
		return next(
			new AppError(409, `email: ${email} already exist, try again`)
		);
	}

	const avatar = await resizeUserAvatar(userId, req.file);

	if (!!avatar && user.avatar !== 'user-default-avatar.jpeg') {
		await access(
			join(__dirname, `../public/image/profile_image/${user.avatar}`),
			constants.F_OK
		);
		console.log(user.avatar)
		await unlink(
			join(__dirname, `../public/image/profile_image/${user.avatar}`)
		);
	}

	user.avatar = avatar ?? user.avatar;
	user.username = username ?? user.username;
	user.email = email ?? user.email;
	user.firstname = firstname ?? user.firstname;
	user.lastname = lastname ?? user.lastname;
	user.gender = gender ?? user.gender;

	await user.save({ validateModifiedOnly: true });

	res.status(202).json({
		status: 'success',
		data: { user }
	});
};

const getUser = async (req, res, next) => {
	const user = await User.findById(req.userId)
	res.status(200).json({ status: "success", data: user });
}

const deleteAccount = async (req, res, next) => {

	const id = req.userId.toString()
	await redisClient.SETEX(id, + process.env.EXPIRES_DATA_IN_REDIS_DELETE_REFRESH_TOKEN, "null")
	const user = await User.findOneAndDelete(req.userId)
	if (user.avatar !== 'user-default-avatar.jpeg') {
		await access(
			join(__dirname, `../public/image/profile_image/${user.avatar}`),
			constants.F_OK
		);
		await unlink(
			join(__dirname, `../public/image/profile_image/${user.avatar}`)
		);
	}

	res.status(204).json({
		status: 'success',
		data: null
	});
;
}

const changePassword = async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;

	const findUser = await User.findById(req.userId).select("+password");
	if (!findUser) return next(new AppError(401, "!username or password is not match"));

	const matchPassword = await comparePasssword(oldPassword, findUser.password);

	if (!matchPassword) return next(new AppError(401, "password is wrong "));

	const hashNewPassword = await hashPasssword(newPassword)

	const updataPassword = await User.findByIdAndUpdate({ _id: findUser.id }, { password: hashNewPassword })

	await redisClient.SETEX(updataPassword.id, + process.env.EXPIRES_DATA_IN_REDIS_DELETE_REFRESH_TOKEN, "null")
	res.status(200).json({ status: "success" });
}




module.exports = { getUser, deleteAccount, changePassword, uploadUserAvatar, editUserProfile  }