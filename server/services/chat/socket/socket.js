const socket = (io) => {
  const onlineMembers = new Map();
  io.on("connection", (socket) => {

    console.log("A user connected ", socket.id,onlineMembers);

    socket.on("online", (user_id) => {
      onlineMembers.set(user_id, socket.id);
      console.log('online user',socket.id,'       444',onlineMembers);
    });

    socket.on("disconnect", (socket) => {
      console.log("disconnedted userr", socket.id);
    });


  });
};

export default socket;
