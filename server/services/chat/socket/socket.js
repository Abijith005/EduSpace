import {
  // addToOnlineMemberList,
  getUserCommunities,
  storeMessages,
  // removeFromOnlineMemberList,
} from "./comunityManager.js";

const socket = (io) => {
  io.on("connection", (socket) => {
    socket.on("online", async (userId) => {
      try {
        const userCommunities = await getUserCommunities(userId);
        userCommunities.forEach((community) => {
          const communityId = community.toString();
          socket.join(communityId);
          console.log(`Socket ${socket.id} joined community ${communityId}`);
        });
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("sendMessage",async (data) => {
      try {
        const { message, userId, userName, communityId } = data;
        const createdAt = new Date();
        await storeMessages(message, communityId, userId);
        io.to(communityId).emit("receiveMessage", {
          message,
          communityId,
          senderId: userId,
          senderName: userName,
          createdAt,
        });
      } catch (error) {
        console.error("Error saving message:", error);
        socket.emit("errorMessage", "Failed to send message");
      }
    });

    socket.on("offline", (userId) => {
      // removeFromOnlineMemberList(userId);
    });
  });
};

export default socket;
