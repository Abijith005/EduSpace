import connectRabbitMQ from "../../config/rabbitmq.js";

let connection, channel;

const connect = async () => {
  try {
    connection =await connectRabbitMQ();
    channel = await connection.createChannel();
    const queue = "user_update_queue";
    await channel.assertQueue(queue, { durable: true });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
};

export const sendUserUpdateTask = async (queue, data) => {
  try {
    if (!channel) {
      await connect();
    }

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    console.log('send to queue');
  } catch (error) {
    console.error("Failed to send message to queue", error);
  }
};
