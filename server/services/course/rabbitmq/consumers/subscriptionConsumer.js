import { connectRabbitMQ } from "../../config/rabbitmq.js";
import subscriptionModel from "../../models/subscriptionModel.js";
import sendMemberTaskQueue from "../producers/memberProducer.js";

const consumeSubscriptionTasks = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "course_subscription";

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
    const { user_id, course_id } = msg;
    await subscriptionModel.create({ course_id, subscriber_id: user_id });
    sendMemberTaskQueue({ user_id, course_id });
  } catch (error) {
    console.error("Failed to process message:", error);
  }
};

export default consumeSubscriptionTasks;
