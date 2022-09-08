const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateHash = require("../utils/generateHash");
const comparePassword = require("../utils/comparePassword");
const jwt = require("jsonwebtoken");

class UserController {
  //validation for input is not done here because we cannot access formdata before uploading using multer
  //so do in frontend
  async signup(req, res, profile_picture) {
    try {
      const { firstname, lastname, email, password, birthday, gender } =
        req.body;
      const response = await userModel.find({ email: email });
      console.log(response);
      if (response.length > 0) {
        return res
          .status(409)
          .json({ success: false, msg: "email already exists" });
      }

      const hashedPassword = generateHash(password);

      const signupUser = await userModel.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
        birthday,
        gender,
        profile_picture,
      });
      return res.json({
        success: true,
        msg: "user has been signed up",
        signupUser,
      });
    } catch (error) {
      return res.json(error);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const emailCheck = await userModel.find({email});

      if (emailCheck.length===0) {
        return res.status(404).json({ success: false, msg: "email unauthorized" });
      }

      const response = comparePassword(password, emailCheck[0].password);
      if (!response) {
        return res.status(400).json({ success: false, msg: "unauthorized" });
      }
    
      const jwtPayload = {
        id: emailCheck[0].id,
      };
      const authToken = jwt.sign(jwtPayload, process.env.JWT_SECRET);

      res.status(200).json({
        msg: "User logged in successfully.",
        success: true,
        authToken,
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }
}

module.exports = UserController;
