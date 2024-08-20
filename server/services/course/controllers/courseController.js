import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import jwtDecode from "../helpers/jwtDecode.js";
import cousreModel from "../models/courseModel.js";
import sendUploadTaskToQueue from "../rabbitmq/producers/uploadProducer.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";
import s3Config from "../config/s3BucketConfig.js";
import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";

const ObjectId = mongoose.Types.ObjectId;

export const uploadCourse = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).send({ message: req.fileValidationError });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send({ message: "No files uploaded" });
    }
    const token = req.headers.authorization.split(" ")[1];
    const user_id = await jwtDecode(token).id;

    const {
      title,
      category_id,
      about,
      price,
      contents,
      courseLevel,
      courseLanguage,
    } = req.body;
    const parsedContents = JSON.parse(contents);

    const course = await cousreModel.create({
      title,
      category_id,
      about,
      price,
      courseLanguage,
      courseLevel,
      contents: parsedContents,
      user_id,
      processingStatus: "uploading",
    });
    const data = {
      title,
      _id: course._id,
    };
    await sendUploadTaskToQueue(req.files, data);
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
      const parsedFilter = JSON.parse(filter);
      const { category_ids, instructor_ids, priceRange, ratingRange } =
        parsedFilter;

      if (category_ids && Array.isArray(category_ids)) {
        parsedFilter.category_ids = category_ids.map((id) => new ObjectId(id));
      }

      if (instructor_ids && Array.isArray(instructor_ids)) {
        parsedFilter.instructor_ids = instructor_ids.map(
          (id) => new ObjectId(id)
        );
      }

      if (parsedFilter.category_ids.length > 0) {
        query.category_id = { $in: parsedFilter.category_ids };
      }

      if (parsedFilter.instructor_ids.length > 0) {
        query.user_id = { $in: parsedFilter.instructor_ids };
      }

      if (priceRange.min && priceRange.max) {
        query.price = { $gte: priceRange.min, $lte: priceRange.max };
      }

      if (ratingRange.min && ratingRange.max) {
        query.rating = { $gte: ratingRange.min, $lte: ratingRange.max };
      }
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
      .limit(limit)
      .populate("category_id", { _id: 1, title: 1 })
      .lean();
    const user_ids = [...new Set(datas.map((item) => item.user_id.toString()))];
    const authQuery = { _id: { $in: user_ids } };
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(authQuery)
    );

    const courses = datas.map((item) => {
      const user_id = userDetails.find((e) => e._id == item.user_id);
      return { ...item, user_id };
    });

    const courseIds = [...new Set(courses.map((item) => item._id))];

    const reviews = await reviewModel.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: "$courseId", totalReviews: { $sum: 1 } } },
    ]);

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
    console.log(req.body);
    if (req.fileValidationError) {
      return res.status(400).send({ message: req.fileValidationError });
    }

    const { course_id } = req.params;

    const {
      title,
      price,
      about,
      category_id,
      courseLanguage,
      courseLevel,
      contents,
      deletedFiles,
    } = req.body;
    const filesToDelete = JSON.parse(deletedFiles);

    const parsedContents = JSON.parse(contents);

    const data = {
      update: true,
      course_id,
      deletedFiles: filesToDelete,
      title,
    };

    let updateOperations = {
      $set: {
        title,
        price,
        about,
        category_id,
        courseLanguage,
        courseLevel,
        contents: parsedContents,
        processingStatus: "updating",
      },
    };

    await cousreModel.findByIdAndUpdate({ _id: course_id }, updateOperations);

    if (Object.keys(req.files).length > 0) {
      await sendUploadTaskToQueue(req.files, data);
      return res.status(200).send({
        success: true,
        message: "Course updating...",
      });
    }

    const deletedFields = ["videos", "notes", "previewVideo", "previewImage"];

    if (Object.keys(filesToDelete).length > 0) {
      const deletedFiles = JSON.parse(req.body.deletedFiles);
      let objectsToDelete = [];
      updateOperations.$pull = {};
      for (const fields of deletedFields) {
        if (deletedFiles[fields]) {
          objectsToDelete.push(
            ...deletedFiles[fields].map((key) => ({ Key: key }))
          );

          updateOperations.$pull[fields] = {
            key: { $in: deletedFiles[fields] },
          };
        }
      }

      if (objectsToDelete.length > 0) {
        const command = new DeleteObjectsCommand({
          Bucket: process.env.S3_BUCKET,
          Delete: {
            Objects: objectsToDelete,
          },
        });
        await s3Config.send(command);
      }
    }

    return res.status(200).send({
      success: true,
      message: "Course updated succesfully",
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllCourseStats = async (req, res) => {
  try {
    const priceRange = await cousreModel.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    // Get count of courses per category
    const categoryData = await cousreModel.aggregate([
      {
        $group: { _id: "$category_id", count: { $sum: 1 } },
      },
      {
        $lookup: {
          from: "categories",
          foreignField: "_id",
          localField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          titleUpper: { $toUpper: { $arrayElemAt: ["$category.title", 0] } },
          title: { $arrayElemAt: ["$category.title", 0] },
          count: 1,
          _id: 1,
        },
      },
      {
        $sort: { titleUpper: 1 },
      },
      {
        $project: {
          title: 1,
          count: 1,
        },
      },
    ]);

    // Get count of courses per teacher
    const teacherData = await cousreModel.aggregate([
      { $group: { _id: "$user_id", count: { $sum: 1 } } },
      {
        $project: {
          _id: 1,
          count: 1,
        },
      },
    ]);
    const teacherIds = teacherData.map((item) => item._id);
    const query = { _id: { $in: teacherIds } };
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(query)
    );

    const instructorData = teacherData.map((item) => {
      const userData = userDetails.find((e) => e._id == item._id);
      return { ...item, name: userData.name };
    });

    // Get rating count
    const ratingData = await cousreModel.aggregate([
      { $project: { roundedRating: { $ceil: "$rating" } } },
      {
        $group: { _id: "$roundedRating", count: { $sum: 1 } },
      },
      {
        $project: {
          _id: 0,
          rating: "$_id",
          count: 1,
        },
      },
      { $sort: { rating: 1 } },
    ]);

    for (let i = 0; i <= 5; i++) {
      if (!ratingData[i] || ratingData[i].rating != i) {
        ratingData.splice(i, 0, { rating: i, count: 0 });
      }
    }
    res.status(200).json({
      success: true,
      data: {
        priceRange: priceRange[0],
        categoryData,
        instructorData,
        ratingData,
      },
    });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseDetails = await cousreModel.findById({ _id: courseId }).lean();
    const user_ids = [courseDetails.user_id];
    const query = { _id: { $in: user_ids } };
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(query)
    );
    courseDetails.user_id = {
      name: userDetails[0].name,
      _id: userDetails[0]._id,
    };

    const totalReviews = await reviewModel
      .find({ courseId: courseId })
      .countDocuments();
    courseDetails.totalReviews = totalReviews;
    res.status(200).json({ success: true, courseDetails: courseDetails });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getCourseData = async (courseIds) => {
  try {
    const data = await cousreModel.find({ _id: { $in: courseIds } });
    return data;
  } catch (error) {
    console.log("Error \n", error);
  }
};

export const getFeaturedCourse = async (req, res) => {
  try {
    const courseDetails = await cousreModel
      .find()
      .sort({ rating: 1 })
      .limit(6).populate('category_id').lean()

    const userIds = [...new Set(courseDetails.map((course) => course.user_id))];
    console.log(userIds);
    const query = { _id: { $in: userIds } };
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(query)
    );
    const courses = courseDetails.map((item) => {
      const user_id = userDetails.find((e) => e._id == item.user_id);
      return { ...item, user_id };
    });
    console.log(courses);
    res.status(200).json({ success: true, courseDetails:courses });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
