import { getUserCommunities, storeMessages } from "./comunityManager.js";

const socket = (io) => {
  io.on("connection", (socket) => {
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

    
    
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Handle offer
    socket.on("offer", (roomId, offer) => {
      console.log('offer created');
      socket.to(roomId).emit("offer", offer); // Send offer to other users in the room
    });

    // Handle answer
    socket.on("answer", (roomId, answer) => {
      socket.to(roomId).emit("answer", answer); // Send answer to other users in the room
    });

    // Handle ICE candidates
    socket.on("ice-candidate", (roomId, candidate) => {
      socket.to(roomId).emit("ice-candidate", candidate); // Send candidate to other users in the room
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });


  });
};

export default socket;
