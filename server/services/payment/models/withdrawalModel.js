import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Teacher ID is required"],
  },
  amount: {
    type: Number,
    required: [true, "Amount is required"],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approved_date: {
    type: Date,
  },
  transaction_id: {
    type: String,
  },
},{timestamps:true});

const withdrawalModel = mongoose.model("withdrawals", withdrawalSchema);

export default withdrawalModel;
