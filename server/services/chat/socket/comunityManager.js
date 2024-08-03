import membersModel from "../models/membersModel.js";
import messageModel from "../models/messagesModel.js";



export const getUserCommunities = async (userId) => {
  try {
    const data = await membersModel.findOne({ userId: userId });
    const communityIds = data?.communities.map(
      (community) => community.communityId
    );
    return communityIds;
  } catch (error) {
    throw error;
  }
};

export const storeMessages = async (message, communityId, userId) => {
  try {
    await messageModel.create({
      senderId: userId,
      communityId,
      message,
      readBy: [userId],
    });
  } catch (error) {
    throw error;
  }
};
