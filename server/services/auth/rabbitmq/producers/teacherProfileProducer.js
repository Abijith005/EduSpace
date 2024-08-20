import connectRabbitMQ from "../../config/rabbitmq.js";

const sendTaskToQueue = async (queue,userId) => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(userId)), {
      persistent: true,
    });

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (error) {
    throw error;
  }
};

export default sendTaskToQueue;
