import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/userModel.js";
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
    });

    // 7. Generate token
    const token = generateToken(newUser._id, "user");

    // 8. Format user data
    const userData = {
      id: newUser._id,
      _id: newUser._id,
      userName: newUser.username,
      firstName: newUser.firstname,
      lastName: newUser.lastname,
      email: newUser.email,
      birthDate: newUser.birthday ? newUser.birthday.toISOString().split('T')[0] : "",
      male: newUser.male,
      points: newUser.point,
      iconUrl: newUser.iconUrl || "",
      role: "USER",
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
    const { username, password } = req.body;

    // 1. Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // 3. Generate and return a JWT token
    let token;
    let role = "USER";
    if (username === ADMIN_USERNAME) {
      token = generateToken(user._id, "admin");
      role = "ADMIN";
    } else {
      token = generateToken(user._id, "user");
    }

    // 4. Format user data
    const userData = {
      id: user._id,
      _id: user._id,
      userName: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      birthDate: user.birthday ? user.birthday.toISOString().split('T')[0] : "",
      male: user.male,
      points: user.point,
      iconUrl: user.iconUrl || "",
      role: role,
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
    res
      .status(500)
      .json({ state: 0, error: error.message, message: "Login failed" });
  }
};
