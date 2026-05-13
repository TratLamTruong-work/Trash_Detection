import bcrypt from "bcryptjs";
import User from "../models/user.js";

import { updateField } from "../lib/usersHelpers.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../middleware/fileUpload.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-passwordHash").sort({ createdAt: -1 }); // Exclude passwordHash field

    const formattedUsers = users.map((user) => ({
      _id: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate
        ? user.birthDate.toISOString().split('T')[0]
        : '',
      male: user.male,
      points: user.points,
      role: user.role ? user.role.toUpperCase() : (user.userName === process.env.ADMIN_USERNAME ? 'ADMIN' : 'USER'),
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
    const user = await User.findById(id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        state: 0,
        message: "User not found",
      });
    }

    // 3. Format response
    const formattedUser = {
      _id: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate
        ? user.birthDate.toISOString().split('T')[0]
        : '',
      male: user.male,
      points: user.points,
      role: user.role ? user.role.toUpperCase() : (user.userName === process.env.ADMIN_USERNAME ? 'ADMIN' : 'USER'),
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

    user.firstName = updateField(firstName, user.firstName);
    user.lastName = updateField(lastName, user.lastName);
    user.email = updateField(email, user.email);

    if (birthDate !== undefined && birthDate !== '') {
      user.birthDate = new Date(birthDate);
    }

    if (male !== undefined) {
      user.male = typeof male === 'string' ? male === 'true' : male;
    }

    if (point !== undefined && point !== null) {
      user.points = Number(point);
    }

    if (role !== undefined) {
      const normalizedRole =
        typeof role === 'string' ? role.toLowerCase() : role;
      if (['admin', 'user'].includes(normalizedRole)) {
        user.role = normalizedRole;
      }
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

    const existingUserName = await User.findOne({ userName });
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
    const finalRole =
      role && typeof role === 'string' && ['admin', 'user'].includes(role.toLowerCase())
        ? role.toLowerCase()
        : 'user';

    const newUser = await User.create({
      userName,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      email,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      male: parsedMale ?? true,
      iconUrl: imageUrl,
      iconPublicId: imagePublicId,
      active: true,
      points: Number.isNaN(parsedPoint) ? 0 : parsedPoint,
      role: finalRole,
    });

    const formattedUser = {
      _id: newUser._id,
      userName: newUser.userName,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      birthDate: newUser.birthDate
        ? newUser.birthDate.toISOString().split('T')[0]
        : '',
      male: newUser.male,
      points: newUser.points,
      role: newUser.role ? newUser.role.toUpperCase() : 'USER',
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
