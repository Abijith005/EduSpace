import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import jwtDecode from "../helpers/jwtDecode.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";
import S3Client from "../config/s3BucketConfig.js";
import fs from "fs";

export const getAllStudents = async (req, res) => {
  try {
    const { search, filter, page, limit } = req.query;
    console.log(filter);

    const searchKeywords = search.split(" ");

    let query = {
      $or: searchKeywords.map((keyword) => ({
        name: { $regex: keyword, $options: "i" },
      })),
    };

    if (filter != "null") {
      query = { ...query, activeStatus: filter };
    }

    const skip = (page - 1) * limit;
    query.role = "student";
    console.log(query);
    const data = await sendRPCRequest("authQueue", JSON.stringify(query));
    const totalPages = Math.ceil(data.length / limit);
    const students = data.slice(skip, limit * page);
    const studentIds = [...new Set(students.map((item) => item._id))];
    const subsciptions = await sendRPCRequest(
      "subscriptionDataQueue",
      JSON.stringify(studentIds)
    );
    const studentsDetails = students.map((student) => {
      const subsciptionsCount = subsciptions.filter(
        (item) => item.subscriber_id == student._id
      ).length;
      student.courseSubscribed = subsciptionsCount;
      return student;
    });
    res.status(200).json({ success: true, studentsDetails, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateStudentStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;
    const query = { _id: userId };
    const update = { $set: { activeStatus: status } };
    await sendRPCRequest("updateAuthQueue", JSON.stringify({ query, update }));
    res
      .status(200)
      .json({ success: true, message: "Student updated successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    console.log("Request received");
    const { name, deletedFile } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;
    const update = {};
    const query = { _id: userId };
    let fileKey, newProfilePic;

    if (name) {
      update.name = name;
    }

    if (req.file) {
      fileKey = `user/${userId}/profilePic-${Date.now()}-${
        req.file.originalname
      }`;
      const fileContent = fs.readFileSync(req.file.path);

      const uploadCommand = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: fileKey,
        Body: fileContent,
        ContentType: req.file.mimetype,
      });

      await S3Client.send(uploadCommand);

      newProfilePic = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileKey}`;

      update.profilePic = { key: fileKey, url: newProfilePic };
    }

    if (deletedFile) {
      console.log("deletedFile :", deletedFile);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: deletedFile,
      });

      const deleteResponse = await S3Client.send(deleteCommand);
      console.log("Old file deleted successfully:", deleteResponse);
    }

    if (Object.keys(update).length > 0) {
      await sendRPCRequest(
        "updateAuthQueue",
        JSON.stringify({ query, update })
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profilePic: { key: fileKey, url: newProfilePic },
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
