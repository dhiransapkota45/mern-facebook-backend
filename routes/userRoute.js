const express = require("express");
const router = express.Router();
const multer = require("multer");
const UserController = require("../controllers/UserController");
const FriendsController = require("../controllers/FriendsController");
// const friendsModel = require("../models/friendsModel");

const PostController = require("../controllers/PostController");

//storage and filename setup using multer
let profile_picture;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/profile_pic");
  },
  filename: function (req, file, cb) {
    profile_picture = Date.now() + "-" + file.originalname.toLocaleLowerCase();
    cb(null, profile_picture);
  },
});

const upload = multer({ storage });

const userControllerInstance = new UserController();
router.post("/signup", upload.single("profile"), (req, res) => {
  userControllerInstance.signup(req, res, profile_picture);
});
router.post("/login", userControllerInstance.login);

const friendControllerInstance = new FriendsController();
router.put(
  "/requestsend/:senderId/:receiverId",
  friendControllerInstance.friendrequsetSend
);
router.put(
  "/acceptrequest/:senderId/:accepterId",
  friendControllerInstance.friendRequestAccept
);

let post_image;
const storageForPost = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/post_image");
  },
  filename: function (req, file, cb) {
    post_image = Date.now() + "-" + file.originalname.toLocaleLowerCase();
    cb(null, post_image);
  },
});

const uploadPostImage = multer({ storage: storageForPost });
const postControllerInstance = new PostController();
router.post("/post/:userId", uploadPostImage.single("post"), (req, res) => {
  postControllerInstance.createPost(req, res, post_image);
});
router.put("/post/like/:postId/:userId", postControllerInstance.likePost)

// router.post("/friends", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { userId } = req.body;
//     console.log(userId);
//     const response = await friendsModel.create({
//       userId: userId,
//     });

//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// });

// router.put("/update/friends/:id", async (req, res) => {
//   try {
//     console.log(req.params.id);
//     console.log(req.body);
//     // const response = await userModel.findByIdAndUpdate()
//     const response = await userModel.findByIdAndUpdate(
//       req.params.id,
//       { $push: { friends: req.body } }
//     );
//     console.log(response);
//   } catch (error) {
//     return res.json(error);
//   }
// });

module.exports = router;
