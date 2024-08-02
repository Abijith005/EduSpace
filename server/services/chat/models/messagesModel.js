import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Sender Id is required"],
    },

    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Communities",
      required: [true, "Community Id is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
