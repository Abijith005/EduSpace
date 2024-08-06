import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    return connection;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    throw error;
  }
};

export default connectRabbitMQ;
