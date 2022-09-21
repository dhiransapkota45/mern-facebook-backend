const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateHash = require("../utils/generateHash");
const comparePassword = require("../utils/comparePassword");
const jwt = require("jsonwebtoken");

class UserController {
  //validation for input is not done here because we cannot access formdata before uploading using multer
  //so do in frontend

  //also make password unsend while sending response 
  async signup(req, res, profile_picture) {
    try {
      const { firstname, lastname, email, password, birthday, gender, friends } =
        req.body;
        // console.log(friends);
      const response = await userModel.find({ email: email });
      // console.log(response);
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
        profile_picture
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

      //later make sure that user details should not include password and other non related data
      res.status(200).json({
        msg: "User logged in successfully.",
        success: true,
        authToken,
        user:emailCheck[0]
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async peopleyoumayknow(req, res){
    console.log("reached here");
    //here i need to fix that the user who is sending request should not be in response sent to client
    const {id} = req.params
    const response = await userModel.find({ _id: {"$ne": id}}).sort({creation_date:-1}).limit(5)
    // const final_data = response.remove({_id:id})
    // return res.send(final_data)
    return res.json({success:true, response})
  }

  
}

module.exports = UserController;
