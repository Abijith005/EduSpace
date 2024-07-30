import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: ["registration", "forgot_password"],
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 1 * 60 * 1000),
  },
});

const otpModel = mongoose.model("Otps", otpSchema);

export default otpModel;
