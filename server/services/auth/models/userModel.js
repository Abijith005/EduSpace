import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      required: [true, "Role is required"],
    },
    profilePic: {
      type: String,
      required: false,
    },
    socialId: {
      type: String,
      unique: true,
      sparse: true,
      required: false,
    },
    activeStatus: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("Users", userSchema);

export default userModel;
