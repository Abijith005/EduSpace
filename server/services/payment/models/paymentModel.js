// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema({
//   sender_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Sender_id is required"],
//   },
//   receiver_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Receiver_id is required"],
//   },
//   course_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: [true, "Course_id is required"],
//   },
//   amount: {
//     type: Number,
//     required: [true, "Amount is requied"],
//   },
// });

// const paymentModel = mongoose.model("Payments", paymentSchema);

// export default paymentModel;

import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["subscription", "withdrawal"],
    required: [true, "Transaction type is required"],
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: function () {
      return this.type === "subscription";
    },
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Receiver_id is required"],
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [function () {
      return this.type === "subscription";
    },'Course id is required'],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  status: {
    type: String,
    enum: ["completed", "pending", "failed"],
    default: "completed",
  },
},{timestamps:true});

const paymentModel = mongoose.model("Payments", paymentSchema);

export default paymentModel;
