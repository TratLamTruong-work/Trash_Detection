import mongoose from "mongoose";

const pointTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    qrCodeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    type: {
      type: String,
      enum: ["earn", "spend"],
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    prevPoint: {
      type: Number,
      required: true,
    },
    currentPoint: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
  },
  { timestamps: true },
);

const PointTransaction = mongoose.model("PointTransaction", pointTransactionSchema);

export default PointTransaction;