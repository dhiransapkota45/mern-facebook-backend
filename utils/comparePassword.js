const bcrypt = require("bcryptjs")

const comparePassword = (userPassword, dbPassword) => {
    
    const password_checker =  bcrypt.compareSync(
        userPassword,
        dbPassword
      );
      return password_checker
}

module.exports = comparePassword