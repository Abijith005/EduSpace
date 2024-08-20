import { connectRabbitMQ } from "../../config/rabbitmq.js";
import withdrawalModel from "../../models/withdrawalModel.js";

const consumeWithdrawalTasks = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "withdrawal_request_queue";

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
    const {
      accountNumber,
      ifsc,
      amount,
      teacherId,
      accountHolder,
      update,
      requestId,
    } = msg;
    if (update) {
      await withdrawalModel.updateOne(
        { _id: requestId },
        { $set: { accountHolder, accountNumber, ifsc, amount } }
      );
    } else {
      await withdrawalModel.create({
        accountNumber,
        ifsc,
        amount,
        teacherId,
        accountHolder,
      });
    }
  } catch (error) {
    console.error("Failed to process message:", error);
  }
};

export default consumeWithdrawalTasks;
