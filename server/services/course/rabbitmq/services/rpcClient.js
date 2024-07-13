import { connectRabbitMQ } from "../../config/rabbitmq.js";
import generateTimeUuid from "../../helpers/generateUuid.js";

const sendRPCRequest = async (queue, message) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  const correlationId = generateTimeUuid();
  const replyQueue = await channel.assertQueue("", { exclusive: true });

  channel.sendToQueue(queue, Buffer.from(message), {
    correlationId: correlationId,
    replyTo: replyQueue.queue,
  });
  return new Promise((resolve, reject) => {
    channel.consume(
      replyQueue.queue,
      (msg) => {
        if (msg.properties.correlationId === correlationId) {
          resolve(JSON.parse(msg.content.toString()));
          connection.close();
        }
      },
      { noAck: true }
    );
  });
};

export default sendRPCRequest;
