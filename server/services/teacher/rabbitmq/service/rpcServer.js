import connectRabbitMQ from "../../config/rabbitmq.js";

const startRPCServer = async (queue, onRequest) => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, { durable: false });
  channel.prefetch(1);

  channel.consume(
    queue,
    async (msg) => {
      if (msg.content) {
        const content = JSON.parse(msg.content.toString());

        const response = await onRequest(content);
        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlationId: msg.properties.correlationId,
          }
        );
      }

      channel.ack(msg);
    },
    { noAck: false }
  );
};

export default startRPCServer;
