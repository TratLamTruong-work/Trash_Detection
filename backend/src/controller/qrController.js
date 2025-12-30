import QRCode from "../schemas/qrCode.js";
import User from "../schemas/user.js";
import crypto from "crypto";

const POINTS_PER_SCAN = 5;

export const generateQRCode = async (req, res) => {
  try {
    const code = crypto.randomBytes(16).toString("hex");

    const qrCode = new QRCode({
      code,
      points: POINTS_PER_SCAN,
      isUsed: false,
    });

    await qrCode.save();

    res.status(201).json({
      success: true,
      message: "Tạo mã QR thành công",
      data: {
        code: qrCode.code,
        points: qrCode.points,
        qrId: qrCode._id,
      },
    });
  } catch (error) {
    console.error("Error in generateQRCode:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi tạo mã QR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const scanQRCode = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp mã QR"
      });
    }

    const qrCode = await QRCode.findOne({ code });

    if (!qrCode) {
      return res.status(404).json({
        success: false,
        message: "Mã QR không hợp lệ"
      });
    }

    if (qrCode.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Mã QR này đã được sử dụng",
        data: {
          usedBy: qrCode.usedBy,
          usedAt: qrCode.usedAt,
        },
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    const prevPoints = user.points;

    user.points += qrCode.points;
    await user.save();

    qrCode.isUsed = true;
    qrCode.usedBy = userId;
    qrCode.usedAt = new Date();
    await qrCode.save();

    res.json({
      success: true,
      message: `Quét mã thành công! Bạn được cộng ${qrCode.points} điểm`,
      data: {
        pointsEarned: qrCode.points,
        prevPoints,
        currentPoints: user.points,
        scannedAt: qrCode.usedAt,
      },
    });
  } catch (error) {
    console.error("Error in scanQRCode:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi quét mã QR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAllQRCodes = async (req, res) => {
  try {
    const { isUsed } = req.query;

    let query = {};
    if (isUsed !== undefined) {
      query.isUsed = isUsed === "true";
    }

    const qrCodes = await QRCode.find(query)
      .populate("usedBy", "userName firstName lastName")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: qrCodes,
    });
  } catch (error) {
    console.error("Error in getAllQRCodes:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách mã QR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getUserQRHistory = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const qrCodes = await QRCode.find({ usedBy: userId, isUsed: true })
      .sort({ usedAt: -1 });

    res.json({
      success: true,
      data: qrCodes,
    });
  } catch (error) {
    console.error("Error in getUserQRHistory:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử quét QR",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
