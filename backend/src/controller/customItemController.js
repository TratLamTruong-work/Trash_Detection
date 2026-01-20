import CustomItem from "../schemas/customItem.js";

// Create a new custom item
export const createCustomItem = async (req, res) => {
  try {
    const customItem = new CustomItem(req.body);
    await customItem.save();
    res.status(201).json({
      message: "Custom item created successfully",
      data: customItem,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create custom item",
      message: error.message,
    });
  }
};

// Get all custom items
export const getCustomItems = async (req, res) => {
  try {
    const customItems = await CustomItem.find();
    res.status(200).json({
      message: "Custom items retrieved successfully",
      data: customItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve custom items",
      message: error.message,
    });
  }
};

// Get custom item by ID
export const getCustomItemById = async (req, res) => {
  try {
    const customItem = await CustomItem.findById(req.params.id);
    if (!customItem) {
      return res.status(404).json({
        error: "Custom item not found",
      });
    }
    res.status(200).json({
      message: "Custom item retrieved successfully",
      data: customItem,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve custom item",
      message: error.message,
    });
  }
};

// Update custom item by ID
export const updateCustomItem = async (req, res) => {
  try {
    const customItem = await CustomItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!customItem) {
      return res.status(404).json({
        error: "Custom item not found",
      });
    }
    res.status(200).json({
      message: "Custom item updated successfully",
      data: customItem,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update custom item",
      message: error.message,
    });
  }
};

// Delete custom item by ID
export const deleteCustomItem = async (req, res) => {
  try {
    const customItem = await CustomItem.findByIdAndDelete(req.params.id);
    if (!customItem) {
      return res.status(404).json({
        error: "Custom item not found",
      });
    }
    res.status(200).json({
      message: "Custom item deleted successfully",
      data: customItem,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete custom item",
      message: error.message,
    });
  }
};

// Delete all custom items
export const deleteAllCustomItems = async (req, res) => {
  try {
    const result = await CustomItem.deleteMany({});
    res.status(200).json({
      message: "All custom items deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete all custom items",
      message: error.message,
    });
  }
};
