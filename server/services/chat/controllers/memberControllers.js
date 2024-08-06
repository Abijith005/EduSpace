import mongoose from "mongoose";
import jwtDecode from "../helpers/jwtDecode.js";
import messageModel from "../models/messagesModel.js";
import membersModel from "../models/membersModel.js";

export const getAllCommunities = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;

    const memberDetails = await membersModel
      .findOne({ userId })
      .populate({
        path: "communities.communityId",
        model: "communities",
      })
      .lean();

    let result = [];

    if (memberDetails) {
      const communityIdsAndDates = memberDetails.communities.map(
        (community) => ({
          communityId: community.communityId._id,
          joinedAt: community.joinedAt,
        })
      );

      const data = await messageModel.aggregate([
        {
          $match: {
            communityId: {
              $in: communityIdsAndDates.map((c) => c.communityId),
            },
          },
        },
        {
          $lookup: {
            from: "members",
            let: { communityId: "$communityId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$userId", new mongoose.Types.ObjectId(userId)],
                  },
                },
              },
              { $unwind: "$communities" },
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$communities.communityId", "$$communityId"] },
                      { $lte: ["$communities.joinedAt", "$createdAt"] },
                    ],
                  },
                },
              },
              {
                $project: {
                  joinedAt: "$communities.joinedAt",
                },
              },
            ],
            as: "membership",
          },
        },
        { $unwind: "$membership" },
        { $sort: { createdAt: 1 } },
        {
          $group: {
            _id: "$communityId",
            messages: { $push: "$$ROOT" },
            unreadCount: {
              $sum: {
                $cond: [
                  {
                    $not: {
                      $in: [new mongoose.Types.ObjectId(userId), "$readBy"],
                    },
                  },
                  1,
                  0,
                ],
              },
            },
            lastMessage: { $last: "$$ROOT" },
          },
        },
        {
          $project: {
            _id: 1,
            unreadCount: 1,
            lastMessage: 1,
          },
        },
      ]);

      const communityDatas = memberDetails.communities.map((item) => {
        const userMessages = data.find(
          (e) => e._id == item.communityId._id.toString()
        );
        item.messages = userMessages?.lastMessage || null;
        item.unreadCount = userMessages?.unreadCount || 0;
        return item;
      });

      result = communityDatas.sort((a, b) => {
        if (!a.messages && !b.messages) return 0;
        if (!a.messages) return 1;
        if (!b.messages) return -1;
        return new Date(b.messages.createdAt) - new Date(a.messages.createdAt);
      });
    }
    res.status(200).json({ success: true, communities: result });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
