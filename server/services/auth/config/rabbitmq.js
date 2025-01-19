import amqp from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://rabbitmq:5672');
    return connection;
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error);
    // setTimeout(connectRabbitMQ, 5000);
    throw error;
  }
};

export default connectRabbitMQ;
