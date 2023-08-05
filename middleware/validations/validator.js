const { AppError } = require('../../utils/AppError');

const validator = validationSchema => {
	return (req, res, next) => {
		const { error } = validationSchema.validate(req.body);

		if (!!error) return next(new AppError(400, error));

		next();
	};
};

const validatores = (validationSchema )=> {
	return (req, res, next) => {
		const { error } = validationSchema.validate(req.body);

		if (!!error) return next(new AppError(400, error));

		next();
	};
};

module.exports = { validator,validatores };