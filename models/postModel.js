const mongoose = require("mongoose");
// const userModel = require("userModel")

const postSchema = new mongoose.Schema({
  description: {
    type: String,
    default:""
  },
  postImage:{
    type:String,
    default:""
  },
  posterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
  },
  postedDate: { type: Date, default: Date.now },
  likers: [{ default: [], type: mongoose.ObjectId, ref: "postModel" }],
  comments: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel",
      },
      comment: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("postModel", postSchema);
