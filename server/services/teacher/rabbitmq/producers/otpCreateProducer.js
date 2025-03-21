import connectRabbitMQ from "../../config/rabbitmq.js";

let connection, channel;
const queue = "create_otp_queue";

const connect = async () => {
  try {
    connection = await connectRabbitMQ();
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
  }
};

export const sendcreateOtpTask = async (data) => {
  try {
    if (!channel) {
      await connect();
    }

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
  } catch (error) {
    console.error("Failed to send message to queue", error);
  }
};
