import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import { generateToken } from "../lib/generateToken.js";

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
      iconUrl,
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

    // 5. Create user
    const newUser = await User.create({
      username: userName,
      password: hashedPassword,
      firstname: firstName,
      lastname: lastName,
      email,
      birthday: birthDate ? new Date(birthDate) : undefined,
      male: male ?? true,
      iconUrl,
      active: true,
      point: 0,
    });

    await newUser.save();

    res.status(201).json({
      state: 1,
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
    if (username === ADMIN_USERNAME) {
      token = generateToken(user._id, "admin");
    } else {
      token = generateToken(user._id, "user");
    }

    res.status(200).json({ state: 1, token });
  } catch (error) {
    res
      .status(500)
      .json({ state: 0, error: error.message, message: "Login failed" });
  }
};
