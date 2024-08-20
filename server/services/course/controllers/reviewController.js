import jwtDecode from "../helpers/jwtDecode.js";
import cousreModel from "../models/courseModel.js";
import reviewModel from "../models/reviewModel.js";
import sendRPCRequest from "../rabbitmq/services/rpcClient.js";

export const addReview = async (req, res) => {
  try {
    const { rating, feedback, courseId } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const userId = await jwtDecode(token).id;
    await reviewModel.create({
      courseId,
      subscriberId: userId,
      rating,
      feedback,
    });
    const totalReviews = await reviewModel.find({ courseId }).countDocuments();
    const course = await cousreModel.findById(courseId);
    const newRating =
      (course.rating * (totalReviews - 1) + rating) / totalReviews;
    console.log(newRating.toFixed(3));
    course.rating = newRating.toFixed(3);
    await course.save();
    res
      .status(200)
      .json({ success: true, message: "Review added successfully" });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getReview = async (req, res) => {
  try {
    const { courseId, page, limit } = req.query;
    const skip = (page - 1) * limit;
    const reviews = await reviewModel
      .find({ courseId })
      .sort({ createdAt: -1 }) 
      .skip(skip)
      .limit(page*limit) 
      .lean();
    const userIds = [...new Set(reviews.map((item) => item.subscriberId))];
    const query = { _id: { $in: userIds } };
    const subscribers = await sendRPCRequest(
      "authQueue",
      JSON.stringify(query)
    );
    const formattedReviews = reviews.map((item) => {
      const subscriber = subscribers.find((e) => (e._id = item.subscriberId));
      delete item.subscriberId;
      return {
        ...item,
        subscriber: subscriber,
      };
    });
    res.status(200).json({ success: true, reviews: formattedReviews });
  } catch (error) {
    console.log("Error \n", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
