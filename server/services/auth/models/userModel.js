import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      unique: true,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      required: false,
    },
    socialId: {
      type: String,
      unique: true,
      sparse:true,
      required: false,
    },
  },
  { timestamps: true }
);

const userModel=mongoose.model("Users",userSchema)

export default userModel