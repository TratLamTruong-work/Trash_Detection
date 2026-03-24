import mongoose from "mongoose";

const defaultItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    pointToTrade: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const DefaultItem = mongoose.model("DefaultItem", defaultItemSchema);

export default DefaultItem;
