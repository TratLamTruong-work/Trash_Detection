import TradeHistory from "../schemas/tradeHistory.js";

// Create a new trade history
export const createTradeHistory = async (req, res) => {
  try {
    const tradeHistory = new TradeHistory(req.body);
    await tradeHistory.save();
    res.status(201).json({
      message: "Trade history created successfully",
      data: tradeHistory,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to create trade history",
      message: error.message,
    });
  }
};

// Get all trade histories
export const getTradeHistories = async (req, res) => {
  try {
    const tradeHistories = await TradeHistory.find();
    res.status(200).json({
      message: "Trade histories retrieved successfully",
      data: tradeHistories,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve trade histories",
      message: error.message,
    });
  }
};

// Get trade history by ID
export const getTradeHistoryById = async (req, res) => {
  try {
    const tradeHistory = await TradeHistory.findById(req.params.id);
    if (!tradeHistory) {
      return res.status(404).json({
        error: "Trade history not found",
      });
    }
    res.status(200).json({
      message: "Trade history retrieved successfully",
      data: tradeHistory,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve trade history",
      message: error.message,
    });
  }
};

// Update trade history by ID
export const updateTradeHistory = async (req, res) => {
  try {
    const tradeHistory = await TradeHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!tradeHistory) {
      return res.status(404).json({
        error: "Trade history not found",
      });
    }
    res.status(200).json({
      message: "Trade history updated successfully",
      data: tradeHistory,
    });
  } catch (error) {
    res.status(400).json({
      error: "Failed to update trade history",
      message: error.message,
    });
  }
};

// Delete trade history by ID
export const deleteTradeHistory = async (req, res) => {
  try {
    const tradeHistory = await TradeHistory.findByIdAndDelete(req.params.id);
    if (!tradeHistory) {
      return res.status(404).json({
        error: "Trade history not found",
      });
    }
    res.status(200).json({
      message: "Trade history deleted successfully",
      data: tradeHistory,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete trade history",
      message: error.message,
    });
  }
};

// Delete all trade histories
export const deleteAllTradeHistories = async (req, res) => {
  try {
    const result = await TradeHistory.deleteMany({});
    res.status(200).json({
      message: "All trade histories deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete all trade histories",
      message: error.message,
    });
  }
};
