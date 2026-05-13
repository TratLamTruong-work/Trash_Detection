import mongoose from "mongoose";

const tradeHistorySchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId:        { type: mongoose.Schema.Types.ObjectId, ref: 'DefaultItem', required: true },
  itemName:      { type: String },
  quantity:      { type: Number, required: true, default: 1 },
  pointsSpent:   { type: Number },
  previousPoint: { type: Number, required: true },
  remainedPoint: { type: Number, required: true },
}, { timestamps: true });

const TradeHistory = mongoose.model("TradeHistory", tradeHistorySchema);
export default TradeHistory;
