import connectRabbitMQ from "../../config/rabbitmq.js";
import teacherProfileModel from "../../models/teacherProfileModel.js";

const consumeProfileTasks = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "teacher_profile";

    await channel.assertQueue(queue, { durable: true });
    await channel.consume(
      queue,
      (msg) => {
        if (msg != null) {
          const message = JSON.parse(msg.content.toString());
          processMessage(message);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error in consumer:", error);
  }
};

const processMessage = async (msg) => {
  try {
    const userId = msg;
    await teacherProfileModel.findOneAndUpdate(
      { userId },
      { userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    console.error("Failed to process message:", error);
  }
};

export default consumeProfileTasks;
