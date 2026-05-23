import mongoose from "mongoose";

const trashBinSchema = new mongoose.Schema(
  {
    binType: {
      type: String,
      required: true,
      unique: true,
      enum: ["organic", "recyclable"],
    },

    currentFillPercent: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["empty", "normal", "warning", "full"],
      default: "empty",
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TrashBin = mongoose.model("TrashBin", trashBinSchema);

export default TrashBin;