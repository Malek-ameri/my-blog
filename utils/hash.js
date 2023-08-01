const bcrypt = require("bcrypt");

const saltRounds = Number(process.env.SALT_ROUND);

const hashPasssword = (password) => {
  return bcrypt.hash(password, saltRounds);
};

const comparePasssword = (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = { hashPasssword, comparePasssword };
