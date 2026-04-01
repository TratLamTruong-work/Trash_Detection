import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    male: {
      type: Boolean,
      default: true,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    point: {
      type: Number,
      default: 0,
      required: true,
    },
    iconUrl: {
      type: String,
      required: true,
    },
    iconPublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
