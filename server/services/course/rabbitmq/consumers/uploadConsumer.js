import fs from "fs";
import s3Config from "../../config/s3BucketConfig.js";
import { connectRabbitMQ } from "../../config/rabbitmq.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import cousreModel from "../../models/courseModel.js";

const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;

const uploadFileToS3 = async (filePath, filename, category, title) => {
  const key = `Course/${title}/${category}/${filename}`;

  try {
    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileContent,
    });

    await s3Config.send(command);

    const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        throw err;  
      }
      console.log("File deleted successfully");
    });

    return { url: s3Url, key };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

const processMessage = async (msg, channel) => {
  try {
    console.log("consuming the message");
    const { files, data } = JSON.parse(msg.content.toString());
    console.log(data);

    const uploadResults = {
      videos: [],
      previewVideo: [],
      previewImage: [],
      notes: [],
    };

    const processFiles = async (files, category) => {
      for (const file of files) {
        const s3File = await uploadFileToS3(
          file.path,
          file.filename,
          category,
          data.title
        );
        uploadResults[category].push(s3File);
      }
    };

    await processFiles(files.videos, "videos");
    await processFiles(files.notes, "notes");
    await processFiles(files.previewVideo, "previewVideo");
    await processFiles(files.previewImage, "previewImage");

    await cousreModel.create({ ...data, ...uploadResults });

    fs.re;

    channel.ack(msg);
  } catch (error) {
    console.error("Failed to process message:", error);
  } finally {
    try {
      await channel.close();
      await channel.connection.close();
    } catch (closeError) {
      console.error("Failed to close channel/connection:", closeError);
    }
  }
};

const startConsumer = async () => {
  const connection = await connectRabbitMQ();
  const channel = await connection.createChannel();
  const queue = "course_upload";

  await channel.assertQueue(queue, { durable: true });
  channel.consume(queue, (msg) => processMessage(msg, channel), {
    noAck: false,
  });

  console.log("Consumer started, waiting for messages...");
};

export default startConsumer;
