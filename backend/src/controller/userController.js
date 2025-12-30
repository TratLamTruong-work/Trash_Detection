import User from "../schemas/user.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      folder: "trash-detection/users",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const user = await User.findById(userId).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    res.json({
      success: true,
      data: {
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
    });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin người dùng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { firstName, lastName, email, birthDate, male } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email đã được sử dụng bởi người dùng khác"
        });
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (birthDate) user.birthDate = new Date(birthDate);
    if (male !== undefined) user.male = male === true || male === "true";

    await user.save();

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: {
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
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật thông tin",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const uploadIcon = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    if (!req.files || !req.files.iconFile) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn file ảnh để upload"
      });
    }

    const iconFile = req.files.iconFile;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(iconFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WEBP"
      });
    }

    const iconUrl = await uploadToCloudinary(iconFile);

    const user = await User.findByIdAndUpdate(
      userId,
      { iconUrl },
      { new: true }
    ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    res.json({
      success: true,
      message: "Upload ảnh đại diện thành công",
      data: {
        iconUrl: user.iconUrl,
      },
    });
  } catch (error) {
    console.error("Error in uploadIcon:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi upload ảnh",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getPoints = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const user = await User.findById(userId).select("points");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    res.json({
      success: true,
      data: {
        points: user.points,
      },
    });
  } catch (error) {
    console.error("Error in getPoints:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy điểm",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
