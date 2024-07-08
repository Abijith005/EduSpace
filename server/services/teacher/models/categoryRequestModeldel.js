import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User id required"],
    },
    category: {
      type: String,
      required: [true, "Category required"],
    },
    certificates: [
      {
        url: {
          type: String,
          required: [true, "Certificate URL required"],
        },
        key: {
          type: String,
          required: [true, "Certificate key is required"],
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const requestModel = mongoose.model("Requests", requestSchema);

export default requestModel;
