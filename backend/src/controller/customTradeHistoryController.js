import CustomTradeHistory from "../schemas/customTradeHistory.js";

// Create a new custom trade history
export const createCustomTradeHistory = async (req, res) => {
  try {
    const customTradeHistory = new CustomTradeHistory(req.body);
    await customTradeHistory.save();
    res.status(201).json({
      message: "Custom trade history created successfully",
      data: customTradeHistory,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create custom trade history",
      message: error.message,
    });
  }
};

// Get all custom trade histories
export const getCustomTradeHistories = async (req, res) => {
  try {
    const customTradeHistories = await CustomTradeHistory.find();
    res.status(200).json({
      message: "Custom trade histories retrieved successfully",
      data: customTradeHistories,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve custom trade histories",
      message: error.message,
    });
  }
};

// Get custom trade history by ID
export const getCustomTradeHistoryById = async (req, res) => {
  try {
    const customTradeHistory = await CustomTradeHistory.findById(req.params.id);
    if (!customTradeHistory) {
      return res.status(404).json({
        error: "Custom trade history not found",
      });
    }
    res.status(200).json({
      message: "Custom trade history retrieved successfully",
      data: customTradeHistory,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve custom trade history",
      message: error.message,
    });
  }
};

// Update custom trade history by ID
export const updateCustomTradeHistory = async (req, res) => {
  try {
    const customTradeHistory = await CustomTradeHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!customTradeHistory) {
      return res.status(404).json({
        error: "Custom trade history not found",
      });
    }
    res.status(200).json({
      message: "Custom trade history updated successfully",
      data: customTradeHistory,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update custom trade history",
      message: error.message,
    });
  }
};

// Delete custom trade history by ID
export const deleteCustomTradeHistory = async (req, res) => {
  try {
    const customTradeHistory = await CustomTradeHistory.findByIdAndDelete(
      req.params.id,
    );
    if (!customTradeHistory) {
      return res.status(404).json({
        error: "Custom trade history not found",
      });
    }
    res.status(200).json({
      message: "Custom trade history deleted successfully",
      data: customTradeHistory,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete custom trade history",
      message: error.message,
    });
  }
};

// Delete all custom trade histories
export const deleteAllCustomTradeHistories = async (req, res) => {
  try {
    const result = await CustomTradeHistory.deleteMany({});
    res.status(200).json({
      message: "All custom trade histories deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete all custom trade histories",
      message: error.message,
    });
  }
};
