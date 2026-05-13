import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/user.js";
import { generateToken } from "../lib/generateToken.js";
import { uploadToCloudinary } from "../middleware/fileUpload.js";

dotenv.config();
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;

export const registerUser = async (req, res) => {
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
    } = req.body;

    // 1. Validate
    if (!userName || !email || !password) {
      return res.status(400).json({
        state: 0,
        message: "userName, email and password are required",
      });
    }

    // 2. Check duplicate userName
    const existingUserName = await User.findOne({ userName });

    if (existingUserName) {
      return res.status(400).json({
        state: 0,
        message: "Username already exists",
      });
    }

    // 3. Check duplicate email
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        state: 0,
        message: "Email already exists",
      });
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Handle file upload first when provided
    const imageFile = req.files?.image;
    let imageUrl = "";
    let imagePublicId;

    if (imageFile) {
      const uploadResult = await uploadToCloudinary(imageFile);
      imageUrl = uploadResult.imageUrl;
      imagePublicId = uploadResult.imagePublicId;
    }

    // 6. Create user with uploaded image URL if available
    const parsedPoint = point !== undefined ? parseInt(point, 10) : 0;
    const parsedMale = typeof male === 'string' ? male === 'true' : male;
    const roleToSet = userName === ADMIN_USERNAME ? 'admin' : 'user';

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
      role: roleToSet,
    });

    // 7. Generate token
    const token = generateToken(newUser._id, roleToSet);

    // 8. Format user data
    const userData = {
      id: newUser._id,
      _id: newUser._id,
      userName: newUser.userName,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      birthDate: newUser.birthDate ? newUser.birthDate.toISOString().split('T')[0] : "",
      male: newUser.male,
      points: newUser.points,
      iconUrl: newUser.iconUrl || "",
      role: roleToSet.toUpperCase(),
    };

    res.status(201).json({
      state: 1,
      data: {
        accessToken: token,
        user: userData,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "User registration failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const username = req.body.username || req.body.userName;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({
        state: 0,
        message: "username and password are required",
      });
    }

    // 1. Find the user by username, fallback to email if input looks like an email
    let user = await User.findOne({ userName: username });
    if (!user && username.includes('@')) {
      user = await User.findOne({ email: username });
    }

    if (!user) {
      return res.status(401).json({
        state: 0,
        message: "User not found",
      });
    }

    // 2. Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        state: 0,
        message: "Invalid password",
      });
    }

    // 3. Generate and return a JWT token
    const role = user.role ? user.role.toUpperCase() : user.userName === ADMIN_USERNAME ? 'ADMIN' : 'USER';
    const tokenType = role === 'ADMIN' ? 'admin' : 'user';
    const token = generateToken(user._id, tokenType);

    // 4. Format user data
    const userData = {
      id: user._id,
      _id: user._id,
      userName: user.userName,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      birthDate: user.birthDate ? user.birthDate.toISOString().split('T')[0] : "",
      male: user.male,
      points: user.points,
      iconUrl: user.iconUrl || "",
      role,
    };

    res.status(200).json({
      state: 1,
      data: {
        accessToken: token,
        user: userData,
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Login failed",
    });
  }
};
