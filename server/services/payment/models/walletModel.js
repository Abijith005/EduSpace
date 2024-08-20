import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
