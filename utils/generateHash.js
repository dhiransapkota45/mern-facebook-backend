const bcrypt = require("bcryptjs");

const generateHash =  (password) => {
  const salt =  bcrypt.genSaltSync(10);
  const hashedPassword =  bcrypt.hashSync(password, salt);
  return hashedPassword;
};

module.exports = generateHash