import mongoose from "mongoose";
import UserRole from "../enum/userRole.js";

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    male: { type: Boolean, required: true },
    points: { type: Number, required: true, default: 0 },
    iconUrl: { type: String, required: true },
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.USER],
      default: UserRole.USER,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
