import fs from "fs";
import s3Config from "../../config/s3BucketConfig.js";
import { connectRabbitMQ } from "../../config/rabbitmq.js";
import { DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import courseModel from "../../models/courseModel.js";
import sendCommuntiyTaskQueue from "../producers/communityProducer.js";
import sendMemberTaskQueue from "../producers/memberProducer.js";

const bucket = process.env.S3_BUCKET;
const region = process.env.S3_REGION;

const uploadFileToS3 = async (filePath, filename, category, title) => {
  try {
    const key = `Course/${title}/${category}/${filename}`;

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
    });

    return { url: s3Url, key };
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};

const processMessage = async (msg, channel) => {
  try {
    const categories = ["videos", "notes", "previewVideo", "previewImage"];

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

      let update = {};

      const deletedFields = ["videos", "notes", "previewVideo", "previewImage"];

      if (Object.keys(data.deletedFiles).length > 0) {
        const deletedFiles = data.deletedFiles;
        let objectsToDelete = [];
        update.$pull = {};

        for (const fields of deletedFields) {
          if (deletedFiles[fields]) {
            objectsToDelete.push(
              ...deletedFiles[fields].map((key) => ({ Key: key }))
            );

            update.$pull[fields] = {
              key: { $in: deletedFiles[fields] },
            };
          }
        }

        const command = new DeleteObjectsCommand({
          Bucket: process.env.S3_BUCKET,
          Delete: {
            Objects: objectsToDelete,
          },
        });
        await s3Config.send(command);
      }
      update.$set = { processingStatus: "completed" };

      await courseModel.findByIdAndUpdate({ _id: data.course_id }, update);
    } else {
      const course = await courseModel.findByIdAndUpdate(
        { _id: data._id },
        {
          $set: {
            videos: uploadResults.videos,
            previewVideo: uploadResults.previewVideo,
            previewImage: uploadResults.previewImage,
            notes: uploadResults.notes,
            processingStatus: "completed",
          },
        }
      );
      const { title } = data;
      const course_id = course._id;
      await sendCommuntiyTaskQueue({ course_id, title });
      await sendMemberTaskQueue({
        user_id: course.user_id,
        course_id: course._id,
      });
    }

    channel.ack(msg);
  } catch (error) {
    console.error("Failed to process message:", error);
  }
};

const startConsumer = async () => {
  try {
    const connection = await connectRabbitMQ();
    const channel = await connection.createChannel();
    const queue = "course_upload";

    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => processMessage(msg, channel), {
      noAck: false,
    });
  } catch (error) {
    console.error("Failed to consume message:", error);
  }
};

export default startConsumer;
