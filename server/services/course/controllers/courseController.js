import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import jwtDecode from "../helpers/jwtDecode.js";
import cousreModel from "../models/courseModel.js";
import sendUploadTaskToQueue from "../rabbitmq/producers/uploadProducer.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";
import s3Config from "../config/s3BucketConfig.js";

export const uploadCourse = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({ message: req.fileValidationError });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: "No files uploaded" });
    }
    const token = req.headers.authorization.split(" ")[1];
    req.body.user_id = jwtDecode(token).id;
    await sendUploadTaskToQueue(req.files, req.body);
    res.status(200).send({
      success: true,
      message: "Files uploaded successfully and processing in background",
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { page, limit, search, filter, id } = req.query;
    let totalDocs;

    const searchKeywords = search.split(" ");

    let query = {
      $or: searchKeywords.map((keyword) => ({
        title: { $regex: keyword, $options: "i" },
      })),
    };

    if (filter) {
      query.category_id = filter;
    }

    if (id) {
      const token = req.headers.authorization.split(" ")[1];
      const user_id = jwtDecode(token).id;
      query = { ...query, user_id: user_id };
      totalDocs = await cousreModel.countDocuments(query);
    } else {
      totalDocs = await cousreModel.countDocuments(query);
    }

    const totalPages = Math.ceil(totalDocs / limit);
    const skip = (page - 1) * limit;
    const datas = await cousreModel
      .find(query)
      .skip(skip)
      .limit(page * limit)
      .populate("category_id", { _id: 1, title: 1 })
      .lean();
    const user_ids = [...new Set(datas.map((item) => item.user_id.toString()))];
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(user_ids)
    );

    const courses = datas.map((item) => {
      const user_id = userDetails.find((e) => e._id == item.user_id);
      return { ...item, user_id };
    });

    return res.status(200).json({ success: true, courses, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateCourse = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({ message: req.fileValidationError });
    }

    const { course_id } = req.params;
    req.body.course_id = course_id;
    req.body.update = true;

    if (Object.keys(req.files).length > 0) {
      await sendUploadTaskToQueue(req.files, req.body);
      // return res.status(200).send({
      //   success: true,
      //   message: "Files uploaded successfully and processing in background",
      // });
    }
    const { title, price, about, category_id } = req.body;

    let updateOperations = { $set: { title, price, about, category_id } };

    const deletedFields = ["videos", "notes", "previewVideo", "previewImage"];

    if (req.body.deletedFiles) {
      const deletedFiles = JSON.parse(req.body.deletedFiles);
      let Objects = [];
      updateOperations.$pull = {};
      for (const fields of deletedFields) {
        if (deletedFiles[fields]) {
          Objects.push(...deletedFiles[fields].map((key) => ({ Key: key })));

          updateOperations.$pull[fields] = {
            key: { $in: deletedFiles[fields] },
          };
        }
      }


      const command = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET,
        Delete: {
          Objects,
        },
      });
      await s3Config.send(command);
    }

    await cousreModel.findByIdAndUpdate({ _id: course_id }, updateOperations);

    return res.status(200).send({
      success: true,
      message: "Course updates succesfully",
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
