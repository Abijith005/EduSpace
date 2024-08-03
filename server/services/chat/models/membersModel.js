import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User Id is required"],
    },
    communities: [
      {
        communityId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "communities",
          required: [true, "Community Id is required"],
        },
        joinedAt: {
          type: Date,
          default: Date.now, 
        },
      },
    ],
  },
  { timestamps: true }
);

const membersModel = mongoose.model("members", memberSchema);

export default membersModel;
