import fs from "fs";
import s3Config from "../../config/s3BucketConfig.js";
import { connectRabbitMQ } from "../../config/rabbitmq.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import courseModel from "../../models/courseModel.js";

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
    const categories = ['videos', 'notes', 'previewVideo', 'previewImage'];

    const { files, data } = JSON.parse(msg.content.toString());

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

    for (const category of categories) {
      if (files[category]) {
        await processFiles(files[category], category);
      }
    }

    if (data.update) {
      const updateOperations = { $set: {} };

      updateOperations.$set.title = data.title;
      updateOperations.$set.price = data.price;
      updateOperations.$set.about = data.about;
      updateOperations.$set.category_id = data.category_id;

      for (const category of categories) {
        if (uploadResults[category].length > 0) {
          if (!updateOperations.$push) updateOperations.$push = {};
          updateOperations.$push[category] = { $each: uploadResults[category] };
        }
      }


      await courseModel.findByIdAndUpdate(
        { _id: data.course_id },
        updateOperations
      );
    } else {
      await courseModel.create({ ...data, ...uploadResults });
    }

    channel.ack(msg);
  } catch (error) {
    console.error("Failed to process message:", error);
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
