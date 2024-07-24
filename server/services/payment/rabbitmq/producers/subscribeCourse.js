import { connectRabbitMQ } from "../../config/rabbitmq.js";

const sendSubscriptionTaskToQueue = async (queue,data) => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), {
      persistent: true,
    });
    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    throw error
  }
};

export default sendSubscriptionTaskToQueue