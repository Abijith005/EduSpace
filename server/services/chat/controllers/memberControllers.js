import jwtDecode from "../helpers/jwtDecode.js";
import membersModel from "../models/membersModel.js";
import messageModel from "../models/messagesModel.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";

export const getAllCommunities = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user_id = jwtDecode(token).id;
    const memberDetails = await membersModel
      .findOne({ user_id })
      .populate("communityIds")
      .lean();
    if (memberDetails) {
      memberDetails["communities"] = memberDetails.communityIds;
      delete memberDetails.communityIds;
    }
    res.status(200).json({ success: true, memberDetails });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const { communityId, page, limit } = req.query;
    const skip = (page - 1) * limit;
    console.log(page, limit, skip);
    const data = await messageModel
      .find({ communityId: communityId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    console.log(data.length);
    const senderIds = [...new Set(data.map((item) => item.senderId))];
    const query = { _id: senderIds };
    const users = await sendRPCRequest("authQueue", JSON.stringify(query));
    const messages = data.map((message) => {
      const user = users.find((e) => e._id == message.senderId);
      message.senderName = user.name;
      return message;
    });

    console.log(messages.length);
    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
