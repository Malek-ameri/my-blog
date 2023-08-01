const { promisify } = require("util")
const User = require("../model/user.model");
const { AppError } = require("../utils/AppError");
const { hashPasssword, comparePasssword } = require("../utils/hash");
const { asyncHandler } = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");
const redisClient = require("../database/redis.connection")



const logout = async (req, res, next) => {

  console.log(req.userId)
  const id = req.userId.toString()
  console.log(id)
  await redisClient.SETEX(id , + process.env.EXPIRES_DATA_IN_REDIS_DELETE_REFRESH_TOKEN,"null")

  res.status(204).json({
    status: 'success',
    data: null
  });
};

const protect = asyncHandler(async (req, res, next) => {
  const { authorization = null } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(
      new AppError(401, 'You are not logged in! Please log in to get access')
    );
  }

  const token = authorization.split(' ')[1];

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_ACCESS_TOKEN_SECRET
  );

  const user = await User.findById(decoded.id);

  if (!user) {
    return next(
      new AppError(401, 'The user belonging to this token does no longer exist')
    );
  }

  req.userId = user._id;
  next();
});

const signToken = id => {
  const accessToken = jwt.sign({ id }, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
  });
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  });

  return { accessToken, refreshToken };
};

const generateToken = async (req, res, next) => {
  const { refreshToken = null } = req.body;

  if (!refreshToken) {
    return next(new AppError(401, 'refresh token missing'));
  }

  const { id } = await promisify(jwt.verify)(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(id)
  if (!user) return next(new AppError(401, 'refresh token missing'))

  const refreshTokenSaved = await redisClient.get(id);

  if (refreshToken !== refreshTokenSaved) {
    return next(new AppError(401, 'refresh token missing'))
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } = signToken(id)
  await redisClient.SETEX(id, + process.env.EXPIRES_DATA_IN_REDIS, newRefreshToken)

  res.status(200).json({
    status: "success",
    token: {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    }
  })
};

const createUser = async (req, res, next) => {
  let { firstname, lastname, username, password, email, gender = "not-set" } = req.body;

  const usernameExist = await User.findOne({ username });
  if (!!usernameExist) return next(new AppError(409, "username exist"));

  const emailExist = await User.findOne({ email });
  if (!!emailExist) return next(new AppError(409, "email exist"));

  password = await hashPasssword(password);

  const user = await User.create({ firstname, lastname, username, password, email, gender, });
  delete user._doc.password;

  const { accessToken, refreshToken } = signToken(user.id)
  await redisClient.SETEX(user.id, + process.env.EXPIRES_DATA_IN_REDIS, refreshToken);

  res.status(201).json({ status: "success", data: user, token: { accessToken, refreshToken } });
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;

  const findUser = await User.findOne({ username }).select("+password");
  if (!findUser) return next(new AppError(401, "!username or password is not match"));

  const matchPassword = await comparePasssword(password, findUser.password);
  if (!matchPassword) return next(new AppError(401, "!username or password is not match"));

  delete findUser._doc.password;

  const { accessToken, refreshToken } = signToken(findUser.id);
  await redisClient.SETEX(findUser.id, + process.env.EXPIRES_DATA_IN_REDIS, refreshToken);
  res.status(201).json({ status: "success", data: findUser, token: { accessToken, refreshToken } });
};

module.exports = { createUser, userLogin, generateToken, protect,logout };