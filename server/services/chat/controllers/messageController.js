import jwtDecode from "../helpers/jwtDecode.js";
import messageModel from "../models/messagesModel.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";

export const getAllMessages = async (req, res) => {
  try {
    let { communityId, page, limit } = req.query;
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;

    const unreadCount = await messageModel
      .find({ communityId: communityId, readBy: { $nin: [userId] } })
      .countDocuments();
    const data = await messageModel
      .find({ communityId: communityId })
      .sort({ createdAt: -1 })
      .limit(limit + unreadCount)
      .skip(skip)
      .lean();
    const senderIds = [...new Set(data.map((item) => item.senderId))];
    const query = { _id: senderIds };
    const users = await sendRPCRequest("authQueue", JSON.stringify(query));
    const messages = data.map((message) => {
      const user = users.find((e) => e._id == message.senderId);
      message.senderName = user.name;
      return message;
    });

    res.status(200).json({ success: true, messages: messages.reverse() });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateMessageRead = async (req, res) => {
  try {
    const { userId, messageId } = req.body;
    await messageModel.updateMany(
      { _id: { $in: messageId } },
      { $push: { readBy: userId } }
    );
    res.json({ success: true });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
