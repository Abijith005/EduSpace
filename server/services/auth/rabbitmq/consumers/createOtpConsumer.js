import connectRabbitMQ from "../../config/rabbitmq.js";
import generateOtp from "../../helpers/generateOtp.js";
import otpModel from "../../models/otpModel.js";
import userModel from "../../models/userModel.js";

export const consumeOtpCreation = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "create_otp_queue";
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, async (msg) => {
      if (msg != null) {
        const message = JSON.parse(msg.content.toString());
        const { userId, purpose } = message;
        const user = await userModel.findById(userId);
        const otp = await generateOtp();
        const data = await otpModel.findOneAndUpdate(
          {
            email: user.email,
            purpose: purpose,
          },
          {
            otp,
            expiresAt: new Date(Date.now() + 1 * 60 * 1000),
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        channel.ack(msg);
      }
    });
  } catch (error) {}
};
