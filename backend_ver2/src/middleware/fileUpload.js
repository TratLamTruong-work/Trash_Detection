import cloudinary from "../lib/cloudinary.js";

export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });

    return {
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    };
  } catch (error) {
    throw new Error("Upload image failed: " + error.message);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("File deleted from Cloudinary successfully");
  } catch (error) {
    throw new Error("Delete image from Cloudinary failed: " + error.message);
  }
};
