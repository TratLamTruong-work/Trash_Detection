import DefaultItem from "../models/defaultItemModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../middleware/fileUpload.js";
import { updateField } from "../lib/usersHelpers.js";

export const getAllItems = async (req, res) => {
  try {
    const items = await DefaultItem.find({}, "-imagePublicId").sort({
      createdAt: -1,
    });

    const formattedItems = items.map((item) => ({
      _id: item._id,
      name: item.name,
      description: item.description,
      active: item.active,
      pointToTrade: item.pointToTrade,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.status(200).json({
      state: 1,
      data: formattedItems,
      message: "Get all items successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Get all items failed",
    });
  }
};

export const createItem = async (req, res) => {
  try {
    const { name, description, pointToTrade } = req.body;

    // 1. Validate input data
    if (!name || !description || !pointToTrade) {
      return res.status(400).json({
        state: 0,
        message: "Name, description, and pointToTrade are required",
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        state: 0,
        message: "Image file is required",
      });
    }

    // 2. Handle file upload
    const imageFile = req.files.image;
    const { imageUrl, imagePublicId } = await uploadToCloudinary(imageFile);

    // 3. Save new item to database
    const newItem = await DefaultItem.create({
      name,
      description,
      pointToTrade,
      imageUrl,
      imagePublicId,
    });

    await newItem.save();

    res.status(201).json({
      state: 1,
      data: newItem,
      message: "Create item successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Create item failed",
    });
  }
};

export const updateItem = async (req, res) => {
  try {
    // 1. Get item ID from request parameters
    const { id } = req.params;

    // 2. Find the item by ID
    const item = await DefaultItem.findById(id);

    // 3. If item not found, return error
    if (!item) {
      return res.status(404).json({
        state: 0,
        message: "Item not found",
      });
    }

    // 4. Update item fields if provided in the request body
    const { name, description, pointToTrade } = req.body;

    item.name = updateField(name, item.name);
    item.description = updateField(description, item.description);

    if (pointToTrade !== undefined && pointToTrade !== null) {
      item.pointToTrade = pointToTrade;
    }

    // 5. Handle file upload if a new image is provided
    if (req.files && req.files.image) {
      const imageFile = req.files.image;

      // 5.1. Delete old image from Cloudinary if it exists
      if (item.imagePublicId) {
        await deleteFromCloudinary(item.imagePublicId);
      }

      // 5.2. Upload new image
      const { imageUrl, imagePublicId } = await uploadToCloudinary(imageFile);

      item.imageUrl = imageUrl;
      item.imagePublicId = imagePublicId;
    }

    // 6. Save the updated item to the database
    await item.save();

    res.status(200).json({
      state: 1,
      data: item,
      message: "Update item successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Update item failed",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the item by ID
    const item = await DefaultItem.findById(id);

    if (!item) {
      return res.status(404).json({
        state: 0,
        message: "Item not found",
      });
    }

    // 2. Delete the item from the database
    await DefaultItem.deleteOne({ _id: id });

    // 3. Delete image from Cloudinary if it exists
    if (item.imagePublicId) {
      await deleteFromCloudinary(item.imagePublicId);
    }

    res.status(200).json({
      state: 1,
      message: "Delete item successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Delete item failed",
    });
  }
};
