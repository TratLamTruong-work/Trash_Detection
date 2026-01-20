import DefaultItem from "../schemas/defaultItem.js";

// Create a new default item
export const createDefaultItem = async (req, res) => {
  try {
    const defaultItem = new DefaultItem(req.body);
    await defaultItem.save();
    res.status(201).json({
      message: "Default item created successfully",
      data: defaultItem,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create default item",
      message: error.message,
    });
  }
};

// Get all default items
export const getDefaultItems = async (req, res) => {
  try {
    const defaultItems = await DefaultItem.find();
    res.status(200).json({
      message: "Default items retrieved successfully",
      data: defaultItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve default items",
      message: error.message,
    });
  }
};

// Get default item by ID
export const getDefaultItemById = async (req, res) => {
  try {
    const defaultItem = await DefaultItem.findById(req.params.id);
    if (!defaultItem) {
      return res.status(404).json({
        error: "Default item not found",
      });
    }
    res.status(200).json({
      message: "Default item retrieved successfully",
      data: defaultItem,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve default item",
      message: error.message,
    });
  }
};

// Update default item by ID
export const updateDefaultItem = async (req, res) => {
  try {
    const defaultItem = await DefaultItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!defaultItem) {
      return res.status(404).json({
        error: "Default item not found",
      });
    }
    res.status(200).json({
      message: "Default item updated successfully",
      data: defaultItem,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update default item",
      message: error.message,
    });
  }
};

// Delete default item by ID
export const deleteDefaultItem = async (req, res) => {
  try {
    const defaultItem = await DefaultItem.findByIdAndDelete(req.params.id);
    if (!defaultItem) {
      return res.status(404).json({
        error: "Default item not found",
      });
    }
    res.status(200).json({
      message: "Default item deleted successfully",
      data: defaultItem,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete default item",
      message: error.message,
    });
  }
};

// Delete all default items
export const deleteAllDefaultItems = async (req, res) => {
  try {
    const result = await DefaultItem.deleteMany({});
    res.status(200).json({
      message: "All default items deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete all default items",
      message: error.message,
    });
  }
};
