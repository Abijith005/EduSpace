import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Course_id is required"],
    },
    title: {
      type: String,
      required: [true, "Community title required"],
    },
    totalMembers: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const communityModel = mongoose.model("communities", communitySchema);

export default communityModel;
