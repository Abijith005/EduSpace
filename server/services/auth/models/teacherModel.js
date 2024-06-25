import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
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
      type: [String],
      default: [],
    },
    wallet: {
      type: Number,
      default: 0.0,
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    active_status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const teacherModel = mongoose.model("teachers", teacherSchema);

export default teacherModel;
