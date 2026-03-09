import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    points: { type: Number, required: true, default: 5 },
    isUsed: { type: Boolean, required: true, default: false },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const QRCode = mongoose.model("QRCode", qrCodeSchema);
export default QRCode;