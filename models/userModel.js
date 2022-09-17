const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  friends: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    },
  ],
  friendRequests: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
    },
  ],
});

const userModel = new mongoose.model("userModel", userSchema);
module.exports = userModel;
