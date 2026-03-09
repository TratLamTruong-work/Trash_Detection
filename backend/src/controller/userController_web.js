import User from "../schemas/user.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcrypt";

// Upload file lên Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

/**
 * CREATE USER (Admin only - role check đã xử lý ở middleware)
 */
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
    } = req.body;

    if (!userName || !password || !email) {
      return res.status(400).json({
        message: "userName, password and email are required",
      });
    }

    // Kiểm tra trùng email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload avatar nếu có
    let iconUrl = null;
    if (req.files && req.files.iconFile) {
      iconUrl = await uploadToCloudinary(req.files.iconFile);
    }

    const newUser = new User({
      userName,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      email,
      birthDate,
      male,
      iconUrl,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Internal server error while creating user",
    });
  }
};

/**
 * UPDATE USER (Admin only)
 */
export const updateUser = async (req, res) => {
  try {
    const { userId, password, ...updateFields } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Nếu có đổi mật khẩu
    if (password) {
      updateFields.passwordHash = await bcrypt.hash(password, 10);
    }

    // Nếu có upload ảnh mới
    if (req.files && req.files.iconFile) {
      updateFields.iconUrl = await uploadToCloudinary(
        req.files.iconFile,
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateFields,
      { new: true, runValidators: true },
    );

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Internal server error while updating user",
    });
  }
};

/**
 * DELETE USER (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Internal server error while deleting user",
    });
  }
};