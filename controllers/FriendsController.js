const userModel = require("../models/userModel");

class FriendsController {
  async friendrequsetSend(req, res) {
    try {
      const { senderId, receiverId } = req.params;
      // console.log(senderId);

      const responseSender = await userModel.findById(senderId);
      const responseReceiver = await userModel.findById(receiverId);
      // console.log(responseReceiver);
      if (responseSender === false || responseReceiver === false) {
        return res.status(400).json({ success: false, msg: "something" });
      }

      const reqList = await userModel.find({
        _id: receiverId,
        "friendRequests.userId": senderId,
      });
      if (reqList.length > 0) {
        return res
          .status(400)
          .json({ success: false, msg: "friend request already sent" });
      }

      const addRequest = await userModel.findByIdAndUpdate(receiverId, {
        $push: { friendRequests: { userId: senderId } },
      });
      console.log(addRequest);
      return res
        .status(200)
        .json({ success: true, msg: "requst sent successfully" });
    } catch (error) {
      return res.send(error);
    }
  }

  async friendRequestAccept(req, res) {
    try {
      const { senderId, accepterId } = req.params;
      const responseSender = await userModel.findById(senderId);
      const responseAccepter = await userModel.findById(accepterId);
      if (responseSender === false || responseAccepter === false) {
        return res.status(400).json({ success: false, msg: "something" });
      }

      //check whether senderId is present in accepter's friendrequest or not
      // const checkRequest = await userModel.find(
      //   { _id: accepterId },
      //   // "friendRequests.userId": senderId, //both does same so you can choose anyone

      //   {
      //     $or: [
      //       { friendRequests: { userId: senderId } },
      //       { friends: { userId: senderId } },
      //     ],
      //   }
      // );

      //   const checkRequest = await userModel.find({
      //     $and: [
      //       {
      //         $or: [
      //           { friendRequests: { userId: senderId } },
      //           { friends: { userId: senderId } },
      //         ],
      //       },
      //       { _id: accepterId }
      //     ],
      //   });
    //   const checkRequest = await userModel.find({
    //     $and: [
    //       { _id: accepterId },
    //       {
    //         $or: [
    //           { "friendRequests.userId" : senderId  },
    //           { "friends.userId":  senderId },
    //         ],
    //       },
    //     ],
    //   });

    const checkRequest = await userModel.find({$and:[
        {_id:accepterId}, {"friendRequests.userId": senderId}
    ]})
      console.log(checkRequest);
    //   if (checkRequest.length === 0) {
    //     return res.status(400).json({
    //       success: false,
    //       msg: "no frinedRequest found from given id",
    //     });
    //   }

      const checkRequest2 = await userModel.find({
        _id:accepterId, friends:{userId:senderId}
      })

      if(checkRequest.length === 0 || checkRequest2.length>0){
        return res.status(400).json({success:false, msg:"some error occured"})
      }

      const confirmRequest = await userModel.findByIdAndUpdate(accepterId, {
        $pull: { friendRequests: { userId: senderId } },
        $push: { friends: { userId: senderId } },
      });

      const confirmRequest2 = await userModel.findByIdAndUpdate(senderId, {
        $push: { friends: { userId: accepterId } },
      });
      return res.status(200).json({ confirmRequest, confirmRequest2 });
    } catch (error) {
      return res.json({ error });
    }
  }
}

module.exports = FriendsController;
