import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
      required: [true, "Course id is required"],
    },
    subscriber_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Subscriber id is requied"],
    },
  },
  { timestamps: true }
);

const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);

export default subscriptionModel;
