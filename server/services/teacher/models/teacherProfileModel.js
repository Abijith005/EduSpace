import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User id required"],
  },
  qualifications: {
    type: [String],
    default: [],
  },
  categories: {
    type: [String],
    default: [],
  },
  certificates: {
    type: [{ url: String, key: String }],
    default: [],
  },
  wallet: {
    type: Number,
    default: 0.0,
  },
  totalCourses: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0.0,
  },
});

const teacherProfileModel = mongoose.model("TeacherProfiles", profileSchema);

export default teacherProfileModel;
