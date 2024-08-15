import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: [true, "Course Id required"],
    },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Subscriber Id required"],
    },

    rating: {
      type: Number,
      required: [true, "Rating required"],
    },
    feedback: {
      type: String,
      required: [true, "Feedback required"],
    },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("reviews", reviewSchema);
export default reviewModel;
