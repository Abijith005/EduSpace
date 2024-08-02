import membersModel from "../models/membersModel.js";
import messageModel from "../models/messagesModel.js";

// const onlineCommunityMembers = new Map();

// export const addToOnlineMemberList = async (userId, socketId) => {
//   try {
//     const userCommunities = await getUserCommunities(userId);

//     userCommunities.forEach((item) => {
//       const communityId = item.toString();
//       if (!onlineCommunityMembers.has(communityId)) {
//         onlineCommunityMembers.set(communityId, new Map());
//       }
//       const communityMembers = onlineCommunityMembers.get(communityId);
//       communityMembers.set(userId, socketId);
//       console.log(onlineCommunityMembers);
//     });
//   } catch (error) {}
// };

// export const removeFromOnlineMemberList = async (userId) => {
//   try {
//     const userCommunities = await getUserCommunities(userId);
//     userCommunities.forEach((communityId) => {
//       const communityMembers = onlineCommunityMembers.get(communityId);
//       communityMembers.delete(userId);
//     });
//   } catch (error) {
//     throw error;
//   }
// };

export const getUserCommunities = async (userId) => {
  try {
    const data = await membersModel.findOne({ user_id: userId });
    return data.communityIds;
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
