import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
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
    active_status:{
      type:Boolean,
      default:true
    }
  },
  { timestamps: true }
);

const studentModel=mongoose.model("Students",studentSchema)

export default studentModel