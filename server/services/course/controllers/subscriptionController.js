import mongoose from "mongoose";
import jwtDecode from "../helpers/jwtDecode.js";
import subscriptionModel from "../models/subscriptionModel.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";
import reviewModel from "../models/reviewModel.js";

export const getAllSubscriptions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, filter } = req.query;
    const skip = (page - 1) * limit;
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;

    let courseFilter = {};
    if (filter) {
      courseFilter = {
        "course.category_id": new mongoose.Types.ObjectId(filter),
      };
    }

    let searchCondition = {};
    if (search) {
      const searchKeywords = search.split(" ");
      searchCondition = {
        $or: searchKeywords.map((keyword) => ({
          "course.title": { $regex: keyword, $options: "i" },
        })),
      };
    }

    const courses = await subscriptionModel.aggregate([
      { $match: { subscriber_id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "courses",
          localField: "course_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $match: {
          ...courseFilter,
          ...searchCondition,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "course.category_id",
          foreignField: "_id",
          as: "course.category_id",
        },
      },
      { $unwind: "$course.category_id" },
      {
        $project: {
          subscriber_id: 0,
          course_id: 0,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }], // Count documents matching the criteria
          data: [{ $skip: skip }, { $limit: parseInt(limit) }], // Apply skip and limit
        },
      },
      {
        $unwind: "$metadata", // Unwind metadata to access the count
      },
      {
        $project: {
          data: 1,
          total: "$metadata.total", // Extract the total count
        },
      },
    ]);

    const totalCourses = courses[0]?.total || 0;
    const courseData = courses[0]?.data || [];

    const userIds = [...new Set(courseData.map((item) => item.course.userId))];
    const query = { _id: { $in: userIds } };
    const userDetails = await sendRPCRequest(
      "authQueue",
      JSON.stringify(query)
    );

    const reviews = await reviewModel.find({ subscriberId: userId });
    const data = courseData.map((item) => {
      const user = userDetails.find((e) => e._id == item.course.userId);
      const review = reviews.find(
        (e) => e.courseId.toString() == item.course._id.toString()
      );

      if (review) {
        item.review = true;
      }

      item.course.userId = user;
      return item;
    });

    const totalPages = Math.ceil(totalCourses / limit);

    res.status(200).json({ success: true, courses: data, totalPages });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const isSubscribed = async (req, res) => {
  try {
    const { courseId } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    const userId = jwtDecode(token).id;
    const course = await subscriptionModel.findOne({
      course_id: courseId,
      subscriber_id: userId,
    });
    let subscribed = false;
    if (course) {
      subscribed = true;
    }
    res.status(200).json({ success: true, subscribed });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
