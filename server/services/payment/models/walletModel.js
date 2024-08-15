import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher", // Assuming you have a Teacher model
      required: [true, "Teacher ID is required"],
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const WalletModel = mongoose.model("wallets", walletSchema);

export default WalletModel;
