import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Teacher ID is required"],
    },
    accountHolder: {
      type: String,
      required: [true, "Account holder required"],
    },
    accountNumber: {
      type: Number,
      required: [true, "Account number required"],
    },
    ifsc: {
      type: String,
      required: [true, "IFSC required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    actionDate: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
  },
  { timestamps: true }
);

const withdrawalModel = mongoose.model("withdrawals", withdrawalSchema);

export default withdrawalModel;
