import mongoose from "mongoose";

const tradeHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DefaultItem",
      required: true,
    },
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    pointsSpent: { type: Number, required: true },
    prevPoint: { type: Number, required: true },
    remainPoint: { type: Number, required: true },
  },
  { timestamps: true }
);

const TradeHistory = mongoose.model("TradeHistory", tradeHistorySchema);
export default TradeHistory;
