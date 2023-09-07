const express = require("express");
const cors = require("cors")
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { connectToDatabase } = require("./database/database.connection");
const apiRouter = require("./routes/routes");
const { AppError } = require("./utils/AppError");


const app = express();
connectToDatabase();
require("./database/redis.connection")

app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", apiRouter );

app.use(function (req, res, next) {
  next(new AppError(404,"Not Found"));
});

app.use((err, req, res, next) => {

  if(err.message.startsWith('Unexpected field')) {
    return res.status(400).json({status:"fail",message:'filed name must be image'})
  }

  if(err.message.startsWith('invalid token')) {
    return res.status(401).json({status:"fail",message:'invalid token'})
  }
  if(err.message.startsWith('jwt expired')) {
    return res.status(401).json({status:"fail",message:'token expired'})
  }
  if(err.message.startsWith('jwt malformed')) {
    return res.status(401).json({status:"fail",message:'refresh token missing'})
  }
  if(err.message.startsWith('invalid signature')) {
    return res.status(401).json({status:"fail",message:'refresh token missing'})
  }

  if(err.message.startsWith('User validation failed')) {
    return res.send({mongoose:"validation"})
  }

  if(err.message.startsWith('E11000')) {
    return res.send({user:"exist"})
  }
	const {
		statusCode = 500,
		status = 'error',
		message = 'internal sever error, not your fault :)'
	} = err;

  console.log(err.message)

	res.status(statusCode).json({ status, message });
});
module.exports = { app };
