import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["purchase", "withdrawal"],
      required: [true, "Transaction type is required"],
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: function () {
        return this.type === "purchase";
      },
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Receiver_id is required"],
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [
        function () {
          return this.type === "purchase";
        },
        "Course id is required",
      ],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    paymentMethod: {
      type: String,
      enum:['razorpay','paypal'],
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction id is required"],
    },
  },
  { timestamps: true }
);

const paymentModel = mongoose.model("Payments", paymentSchema);

export default paymentModel;
