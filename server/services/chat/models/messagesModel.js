import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Sender Id is requried"],
    },

    communityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Communities",
      required: [true, "Receiver Id is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("messages", messageSchema);

export default messageModel;
