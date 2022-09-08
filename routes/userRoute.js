const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController")
const multer = require("multer");
const UserController = require("../controllers/UserController");

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

const userControllerInstance = new UserController

router.post("/signup", upload.single("profile"), (req, res) => {
    userControllerInstance.signup(req, res, profile_picture)
});

router.post("/login", userControllerInstance.login);

module.exports = router;
