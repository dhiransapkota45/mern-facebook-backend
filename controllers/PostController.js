const postModel = require("../models/postModel");
const userModel = require("../models/userModel")

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

  async addComment(req, res){
    try {
      const {postId, userId} = req.params
      console.log(req.body);
      const {comment} = req.body
      if(!postId || !userId ||!comment){
        return res.status(400).json({success:false, msg:"imcomplete request"})
      }

      const checkPost = await postModel.findById(postId)
      if(checkPost.length===0){
        return res.status(400).json({success:false, msg:"post does not exist"})
      }

      const checkUser = await userModel.findById(userId)
      if(checkUser.length===0){
        return res.status(400).json({success:false, msg:"user does not exist"})
      }

      //here we can add validation for checking if the owner of post is friends with commenter or not 
      //but that is not neccessary

      const response = await postModel.findByIdAndUpdate(postId, {
        $push:{comments:{userId:userId, comment:comment}}
      })
      console.log(response);

      return res.status(200).json({success:true, msg:"comment added successfully"})
    } catch (error) {
      return res.status(400).json({success:false})
    }
  }

  async getComment(req, res){
    const {id} = req.params
    const checkPost = await postModel.findById(id)
    if(checkPost.length === 0){
      return res.status(400).json({success:false, msg:"post does not exist"})
    } 

    const getUser = await postModel.findById(id).select("comments").populate("comments.userId", "firstname lastname profile_picture").sort({posted_date:-1})
    console.log(getUser);
    return res.send(getUser)
  }
}

module.exports = PostController;
