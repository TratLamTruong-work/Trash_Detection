import User from "../models/userModel.js";

import { updateField } from "../lib/usersHelpers.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../middleware/fileUpload.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 }); // Exclude password field

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      userName: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      birthDate: user.birthday,
      male: user.male,
      active: user.active,
      totalPoint: user.point,
      iconUrl: user.iconUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    res.status(200).json({
      state: 1,
      data: formattedUsers,
      message: "Get all users successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Get all users failed",
    });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    // 1. Get user ID from request parameters
    const { id } = req.params;

    // 2. Find the user by ID
    const user = await User.findById(id);

    // 3. If user not found, return error
    if (!user) {
      return res.status(404).json({
        state: 0,
        message: "User not found",
      });
    }

    // 4. Update user fields if provided in the request body
    const { firstName, lastName, email, birthDate, male, totalPoint } =
      req.body;

    user.firstname = updateField(firstName, user.firstname);
    user.lastname = updateField(lastName, user.lastname);
    user.email = updateField(email, user.email);
    user.birthday = updateField(birthDate, user.birthday);

    // With boolean, we need to check if the value is explicitly provided (not undefined)
    if (male !== undefined) user.male = male;

    // With number, we also need to check if the value is explicitly provided (not undefined)
    if (totalPoint !== undefined && totalPoint !== null) {
      user.point = totalPoint;
    }

    // 5. Handle file upload if a new image is provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image;

      // 5.1. Delete old image from Cloudinary if it exists
      if (user.iconPublicId) {
        await deleteFromCloudinary(user.iconPublicId);
      }

      // 5.2. Upload new image
      const { imageUrl, imagePublicId } = await uploadToCloudinary(imageFile);

      user.iconUrl = imageUrl;
      user.iconPublicId = imagePublicId;
    }

    await user.save();

    res.status(200).json({
      state: 1,
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Update user failed",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Delete the user
    await user.deleteOne({ _id: id });

    if (user.iconPublicId) {
      await deleteFromCloudinary(user.iconPublicId);
    }

    res.status(200).json({
      state: 1,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Delete user failed",
    });
  }
};
