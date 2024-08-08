import connectRabbitMQ from "../../config/rabbitmq.js";
import userModel from "../../models/userModel.js";

export const consumeUserUpdate = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "user_update_queue";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg != null) {
        const message = JSON.parse(msg.content.toString());
        const { query, update } = message;
        await userModel.updateOne(query, update);
        channel.ack(msg);
      }
    });
  } catch (error) {}
};
