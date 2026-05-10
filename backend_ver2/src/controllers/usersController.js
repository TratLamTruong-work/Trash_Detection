import bcrypt from "bcryptjs";
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
      birthDate: user.birthday
        ? user.birthday.toISOString().split('T')[0]
        : '',
      male: user.male,
      points: user.point,
      role: user.role || (user.username === process.env.ADMIN_USERNAME ? 'ADMIN' : 'USER'),
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

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Validate input
    if (!id) {
      return res.status(400).json({
        state: 0,
        message: "User ID is required",
      });
    }

    // 2. Find user by ID (loại bỏ password)
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        state: 0,
        message: "User not found",
      });
    }

    // 3. Format response
    const formattedUser = {
      _id: user._id,
      userName: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      birthDate: user.birthday
        ? user.birthday.toISOString().split('T')[0]
        : '',
      male: user.male,
      points: user.point,
      role: user.role || (user.username === process.env.ADMIN_USERNAME ? 'ADMIN' : 'USER'),
      iconUrl: user.iconUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      state: 1,
      data: formattedUser,
      message: "Get user successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Get user failed",
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
    const { firstName, lastName, email, birthDate, male, point, role } =
      req.body;

    user.firstname = updateField(firstName, user.firstname);
    user.lastname = updateField(lastName, user.lastname);
    user.email = updateField(email, user.email);

    if (birthDate !== undefined && birthDate !== '') {
      user.birthday = new Date(birthDate);
    }

    if (male !== undefined) {
      user.male = typeof male === 'string' ? male === 'true' : male;
    }

    if (point !== undefined && point !== null) {
      user.point = Number(point);
    }

    if (role !== undefined && ['ADMIN', 'USER'].includes(role)) {
      user.role = role;
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

export const createUser = async (req, res) => {
  try {
    const {
      userName,
      password,
      firstName,
      lastName,
      email,
      birthDate,
      male,
      point,
      role,
    } = req.body;

    if (!userName || !email || !password) {
      return res.status(400).json({
        state: 0,
        message: "userName, email and password are required",
      });
    }

    const existingUserName = await User.findOne({ username: userName });
    if (existingUserName) {
      return res.status(400).json({
        state: 0,
        message: "Username already exists",
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        state: 0,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const imageFile = req.files?.image;
    let imageUrl = "";
    let imagePublicId;

    if (imageFile) {
      const uploadResult = await uploadToCloudinary(imageFile);
      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.imagePublicId;
    }

    const parsedPoint = point !== undefined ? parseInt(point, 10) : 0;
    const parsedMale = typeof male === 'string' ? male === 'true' : male;
    const finalRole = ['ADMIN', 'USER'].includes(role) ? role : 'USER';

    const newUser = await User.create({
      username: userName,
      password: hashedPassword,
      firstname: firstName,
      lastname: lastName,
      email,
      birthday: birthDate ? new Date(birthDate) : undefined,
      male: parsedMale ?? true,
      iconUrl: imageUrl,
      iconPublicId: imagePublicId,
      active: true,
      point: Number.isNaN(parsedPoint) ? 0 : parsedPoint,
      role: finalRole,
    });

    const formattedUser = {
      _id: newUser._id,
      userName: newUser.username,
      firstName: newUser.firstname,
      lastName: newUser.lastname,
      email: newUser.email,
      birthDate: newUser.birthday
        ? newUser.birthday.toISOString().split('T')[0]
        : '',
      male: newUser.male,
      points: newUser.point,
      role: newUser.role,
      iconUrl: newUser.iconUrl || '',
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      state: 1,
      data: formattedUser,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Create user failed",
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
