import { connectRabbitMQ } from "../../config/rabbitmq.js";
import WalletModel from "../../models/walletModel.js";
import withdrawalModel from "../../models/withdrawalModel.js";

const consumeWalletTasks = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "update_wallet_queue";

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
    console.log(msg);
    const { query,update } = msg;
    const d = await WalletModel.findOneAndUpdate(query,update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }); 
    console.log(d);
  } catch (error) {
    console.error("Failed to process message:", error);
  }
};

export default consumeWalletTasks;
