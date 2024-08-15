import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, "File URL is required"],
    },
    key: {
      type: String,
      required: [true, "File key is required"],
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User id is required"],
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: [true, "Category id is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    about: {
      type: String,
      required: [true, "About is required"],
    },
    courseLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: [true, "Course level is required"],
    },
    courseLanguage: {
      type: String,
      required: [true, "Course language is required"],
    },
    contents: {
      type: [String],
      required: [true, "Contents is requied"],
    },
    processingStatus: {
      type: String,
      required: [true, "Status is required"],
      enum: ["uploading", "updating", "completed"],
    },
    previewImage: {
      type: [fileSchema],
    },
    previewVideo: {
      type: [fileSchema],
    },
    videos: [fileSchema],

    notes: [fileSchema],

    rating: {
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

const cousreModel = mongoose.model("courses", courseSchema);
export default cousreModel;
