import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../schemas/user.js";
import { generateToken } from "../services/tokenService.js";

dotenv.config();

const DEFAULT_ICON_URL = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

export const signUp = async (req, res) => {
  try {
    const { userName, password, firstName, lastName, email, birthDate, male } = req.body;

    if (!userName || !password || !firstName || !lastName || !email || !birthDate || male === undefined) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin"
      });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Tên đăng nhập đã tồn tại"
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng"
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      userName,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      email,
      birthDate: new Date(birthDate),
      male: male === true || male === "true",
      points: 0,
      iconUrl: DEFAULT_ICON_URL,
    });

    await newUser.save();

    const { accessToken, refreshToken } = generateToken(newUser._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      data: {
        accessToken,
        user: {
          id: newUser._id,
          userName: newUser.userName,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          birthDate: newUser.birthDate,
          male: newUser.male,
          points: newUser.points,
          iconUrl: newUser.iconUrl,
        },
      },
    });
  } catch (error) {
    console.error("Error in signUp:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng ký",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập tên đăng nhập và mật khẩu"
      });
    }

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Tên đăng nhập không tồn tại"
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Mật khẩu không đúng"
      });
    }

    const { accessToken, refreshToken } = generateToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      data: {
        accessToken,
        user: {
          id: user._id,
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthDate: user.birthDate,
          male: user.male,
          points: user.points,
          iconUrl: user.iconUrl,
        },
      },
    });
  } catch (error) {
    console.error("Error in signIn:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng nhập",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy refresh token"
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Refresh token thành công",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Refresh token đã hết hạn, vui lòng đăng nhập lại",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Refresh token không hợp lệ",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server khi refresh token",
    });
  }
};

export const signOut = (req, res) => {
  try {
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.error("Error in signOut:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đăng xuất",
    });
  }
};
