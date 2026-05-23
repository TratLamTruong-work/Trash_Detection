import mongoose from "mongoose";

const trashBinLogSchema = new mongoose.Schema(
  {
    binType: {
      type: String,
      required: true,
      enum: ["organic", "recyclable"],
    },

    fillPercent: {
      type: Number,
      required: true,
    },

    timestamp: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const TrashBinLog = mongoose.model(
  "TrashBinLog",
  trashBinLogSchema
);

export default TrashBinLog;