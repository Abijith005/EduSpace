import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Sender_id is required"],
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Receiver_id is required"],
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Course_id is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is requied"],
  },
});

const paymentModel = mongoose.model("Payments", paymentSchema);

export default paymentModel;
