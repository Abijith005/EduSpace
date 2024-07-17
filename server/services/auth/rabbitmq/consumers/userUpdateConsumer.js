import connectRabbitMQ from "../../config/rabbitmq.js";
import teacherModel from "../../models/teacherModel.js";

export const consumeUserUpdate = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "user_update_queue";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg != null) {
        console.log(JSON.parse(msg.content.toString()));
        const message = JSON.parse(msg.content.toString());
        const { query, update } = message;
        console.log(query,update);
      const updateddd=  await teacherModel.updateOne(query, update);
        console.log('updated user',updateddd);
        channel.ack(msg)
      }
    });
  } catch (error) {}
};


