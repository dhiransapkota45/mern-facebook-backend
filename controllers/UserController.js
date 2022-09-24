const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateHash = require("../utils/generateHash");
const comparePassword = require("../utils/comparePassword");
const jwt = require("jsonwebtoken");
const postModel = require("../models/postModel");
const imagePath = require("../utils/imagePath");

class UserController {
  //validation for input is not done here because we cannot access formdata before uploading using multer
  //so do in frontend

  //also make password unsend while sending response
  async signup(req, res, profile_picture) {
    try {
      const { firstname, lastname, email, password, birthday, gender } =
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
      const emailCheck = await userModel.find({ email });

      if (emailCheck.length === 0) {
        return res
          .status(404)
          .json({ success: false, msg: "email unauthorized" });
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
        user: emailCheck[0],
      });
    } catch (error) {
      return res.status(400).json(error);
    }
  }

  async peopleyoumayknow(req, res) {
    // console.log("reached here");
    //here i need to fix that the user who is sending request should not be in response sent to client
    // const {id} = req.params
    // const findFriendRequest = await userModel.findById(id).select("friendRequests")
    // const friendReq = findFriendRequest.friendRequests
    // // console.log(friendReq);
    // // const newFriendReq = friendReq.push(id)
    // // console.log(newFriendReq);
    // const response = await userModel.find({ _id: {"$ne": [...friendReq, id]}}).sort({creation_date:-1}).limit(5)
    // // const final_data = response.remove({_id:id})
    // // return res.send(final_data)
    // return res.json({success:true, response, friends:findFriendRequest.friendRequests})

    try {
      // const {id} = req.params
      // const user = await userModel.findById(id)
      // // const newarray = [...user.friendRequests, id]
      // // console.log(newarray);
      // const newresponse = await userModel.find({_id:user.friendRequests}).select("_id")
      // // console.log([newresponse._id]);

      // const response = await userModel.find({_id:{"$ne":id}}).sort({creation_date:-1}).limit(5)
      // return res.json({succcess:true, response, newresponse})
      const { id } = req.params;

      const user = await userModel.findById(
        id,
        "friends friendRequests requestSent"
      );
      // console.log(user);

      // const excludeUsersArray = user.friends.concat(user.friendRequests);
      const excludeUsersArray = [
        ...user.friends,
        ...user.friendRequests,
        ...user.requestSent,
      ];
      console.log(excludeUsersArray);

      const response = await userModel
        .find({ _id: { $nin: [...excludeUsersArray, id] } })
        .sort({ creation_date: -1 })
        .limit(10);

      return res.json({ succcess: true, response });
    } catch (error) {
      console.log(error);
    }
  }

  async getFriendRequest(req, res) {
    try {
      const { id } = req.params;
      const userInfo = await userModel.findById(id, "friendRequests");
      const response = await userModel.find({ _id: userInfo.friendRequests });
      return res.json({ success: true, response });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
  }

  async getPost(req, res) {
    try {
      const { id } = req.params;
      const getFriends = await userModel.findById(id, "friends");
      console.log(getFriends);

      if (getFriends.friends.length === 0) {
        return res.status(200).json({ success: true, getPost: [] });
      }
      const checkPostsOfFriends = await postModel.find({
        posterId: getFriends.friends,
      });
      console.log(checkPostsOfFriends);
      if (checkPostsOfFriends.length === 0) {
        return res.status(200).json({ success: true, getPost: [] });
      }
      const getPostRaw = await postModel
        .find({ posterId: getFriends.friends })
        .populate("posterId", "firstname lastname profile_picture")
        .sort({ postedDate: -1 });
      console.log(getPostRaw[0].postImage);
      const getPost = imagePath(getPostRaw);
      console.log(getPost);
      return res.status(200).json({ succcess: true, getPost });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
  }
}

module.exports = UserController;
