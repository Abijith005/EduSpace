import { getUserCommunities, storeMessages } from "./comunityManager.js";

const socket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user going online
    socket.on("online", async (userId) => {
      try {
        const userCommunities = await getUserCommunities(userId);
        if (userCommunities?.length > 0) {
          userCommunities.forEach((community) => {
            const communityId = community.toString();
            socket.join(communityId);
          });
        }
      } catch (error) {
        console.error("Error joining room:", error);
      }
    });

    socket.on("sendMessage", async (data) => {
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

    socket.on("offline", () => {
      socket.leaveAll();
    });

    socket.on("logout", () => {
      try {
        socket.leaveAll();
        socket.disconnect(true);
      } catch (error) {
        console.error("Error during logout:", error);
      } 
    });

    // Handle joining a room
    socket.on("join-room", (roomId, userId) => {
      console.log(`User ${userId} joined room ${roomId}`);
      socket.join(roomId);
      io.to(roomId).emit("user-connected", userId);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });

    // Handle leaving a room
    socket.on("leave-room", (roomId, userId) => {
      console.log(`User ${userId} left room ${roomId}`);
      socket.leave(roomId);
      io.to(roomId).emit("user-disconnected", userId);
    });

    // Handle ending a meeting
    socket.on("end-meeting", (roomId) => {
      console.log(`Meeting ended in room ${roomId}`);
      io.to(roomId).emit("meeting-ended");
    });
  });
};

export default socket;
