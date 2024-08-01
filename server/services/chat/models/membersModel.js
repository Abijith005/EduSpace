import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User Id is required"],
    },
    communityIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref:'communities',
      required: [true, "community Id is required"],
    },
  },
  { timestamps: true }
);

const membersModel = mongoose.model("members", memberSchema);

export default membersModel;
