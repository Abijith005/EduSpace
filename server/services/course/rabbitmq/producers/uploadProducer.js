import { connectRabbitMQ } from "../../config/rabbitmq.js";

const sendUploadTaskToQueue = async (files, data) => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "course_upload";

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify({ files, data })), {
      persistent: true,
    });

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 5000);
  } catch (error) {
    throw error;
  }
};

export default sendUploadTaskToQueue;
