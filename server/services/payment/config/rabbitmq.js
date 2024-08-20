import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    console.log("Rabbit MQ connection created");
    return connection;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};
