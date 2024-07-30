import connectRabbitMQ from "../../config/rabbitmq.js";
import communityModel from "../../models/communityModel.js";

const consumeCommunityTask = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "communityQueue";
    await channel.assertQueue(queue, { durable: true });
    channel.consume(
      queue,
      (msg) => {
        if (msg != null) {
          const data = JSON.parse(msg.content.toString());
          procesMessage(data);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error in consumer:", error);
  }
};

const procesMessage = async (data) => {
  try {
    const { course_id, title } = data;
    await communityModel.create({ course_id, title });
  } catch (error) {
    console.error("Failed to process message:", error);
  }
};

export default consumeCommunityTask;
