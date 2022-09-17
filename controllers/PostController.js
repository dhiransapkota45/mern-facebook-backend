const postModel = require("../models/postModel");

class PostController {
  async createPost(req, res, post_image) {
    try {
      const { userId } = req.params;
      const { description } = req.body;
      console.log(description, post_image, userId);
      const createPost = await postModel.create({
        description,
        postImage: post_image,
        posterId: userId,
      });

      return res.status(200).json({
        success: true,
        msg: "post has been saved to the database",
        createPost,
      });
    } catch (error) {
      return res.status(400).send(error);
    }
  }

  //used for liking a post as well as unliking it
  async likePost(req, res) {
    try {
      const { postId, userId } = req.params;
      console.log(postId, userId);
      if (!postId || !userId) {
        return res.status(400).json({ msg: "userid or postid not found" });
      }
      //   const findLikedUser = await postModel.find({$and:[{posterId:postId}, {likers:userId}]})
      const findLikedUser = await postModel.find({
        _id: postId,
        likers: userId,
      });
      console.log(findLikedUser.length);


      if (findLikedUser.length > 0) {
        const removeLike = await postModel.findByIdAndUpdate(postId, {
          $pull: { likers: userId },
        });
        return res.status(200).json({
          success: true,
          msg: "unliked post successfully",
          removeLike,
        });
      } else {
        const addLike = await postModel.findByIdAndUpdate(postId, {
          $push: { likers: userId },
        });
        return res
          .status(200)
          .json({ success: true, msg: "post liked!", addLike });
      }
    } catch (error) {
      return res.send(error);
    }
  }
}

module.exports = PostController;
