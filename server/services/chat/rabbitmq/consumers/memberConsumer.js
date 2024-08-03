import connectRabbitMQ from "../../config/rabbitmq.js";
import communityModel from "../../models/communityModel.js";
import membersModel from "../../models/membersModel.js";

const consumeMemberTask = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "membersQueue";
    await channel.assertQueue(queue, { durable: true });
    channel.consume(
      queue,
      (msg) => {
        if (msg != null) {
          const data = JSON.parse(msg.content.toString());
          processMessage(data);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error in consumer:", error);
  }
};

const processMessage = async (data) => {
  try {
    const { user_id, course_id } = data;
    const community = await communityModel.findOne({ course_id: course_id });

    const result = await membersModel.findOneAndUpdate(
      { userId: user_id, "communities.communityId": { $ne: community._id } },
      {
        $addToSet: {
          communities: {
            communityId: community._id.toString(),
            joinedAt: new Date(),
          },
        },
      },
      { new: true, upsert: true }
    );
  } catch (error) {
    console.error("Error in consumer:", error);
  }
};

export default consumeMemberTask;
