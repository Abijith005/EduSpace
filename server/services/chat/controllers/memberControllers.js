import mongoose from "mongoose";
import jwtDecode from "../helpers/jwtDecode.js";
import membersModel from "../models/membersModel.js";
import messageModel from "../models/messagesModel.js";

export const getAllCommunities = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;
    const memberDetails = await membersModel
      .findOne({ user_id: userId })
      .populate("communityIds")
      .lean();
    const communityIds = [
      ...new Set(memberDetails.communityIds.map((community) => community._id)),
    ];

    const data = await messageModel.aggregate([
      { $match: { communityId: { $in: communityIds } } },
      { $sort: { createdAt: 1 } },
      { $group: { _id: "$communityId", messages: { $push: "$$ROOT" } } },
      {
        $addFields: {
          unreadCount: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $not: {
                    $in: [
                      new mongoose.Types.ObjectId(userId),
                      "$$message.readBy",
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$messages", -1] },
        },
      },
      { $addFields: { community: "$_id" } },
      {
        $project: {
          _id: 1,
          unreadCount: 1,
          lastMessage: 1,
        },
      },
    ]);

    const communityDatas = memberDetails.communityIds.map((item) => {
      const userMessages = data.find((e) => e._id == item._id.toString());
      item.messages = userMessages?.lastMessage || null;
      item.unreadCount = userMessages?.unreadCount || 0;
      return item;
    });

    const sortedData = communityDatas.sort((a, b) => {
      if (!a.messages && !b.messages) return 0;
      if (!a.messages) return 1; 
      if (!b.messages) return -1; 
      return new Date(b.messages.createdAt) - new Date(a.messages.createdAt);
    });
    
    console.log(sortedData, "this is sorted data");

    res.status(200).json({ success: true, communities: sortedData });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
