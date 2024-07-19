import mongoose from "mongoose";
import validator from "validator";

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Category title  is required"],
      set: (value) => validator.escape(value),
    },
    icon: {
      type: String,
      required: [true, "category icon is required"],
      set: (value) => validator.escape(value),
    },
    totalCourses: {
      type: Number,
      default: 0,
    },
    totalInstructors: {
      type: Number,
      default: 0,
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);


const categoryModel = mongoose.model("categories", categorySchema);

export default categoryModel;
