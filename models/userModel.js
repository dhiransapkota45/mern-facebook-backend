const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  password: String,
  email: {
    type: String,
    unique: true,
  },
  birthday: Date,
  creation_date: {
    type: Date,
    default: Date.now,
  },
  gender: String,
  profile_picture: {
    type: String,
    default: "",
  },
  // friends: [
  //   {
  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "userModel",
  //     },
  //   },
  // ],
  friends:[{
    type:mongoose.ObjectId,
    ref:"userModel"
  }],
  // friendRequests: [
  //   {
  //     userId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "userModel",
  //     },
  //   },
  // ],
  friendRequests:[{
    type:mongoose.ObjectId,
    ref:"userModel"
  }],
  requestSent:[{
    type:mongoose.ObjectId,
    ref:"userModel"
  }]

});

module.exports = mongoose.model("userModel", userSchema);

