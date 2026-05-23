import PointTransaction from "../models/pointTransaction.js";

const successResponse = (data, message = "Success") => ({
  state: 1,
  data,
  message,
});

const errorResponse = (message, error = null) => ({
  state: 0,
  message,
  error,
});

export const getAllTransactions = async (req, res) => {
  try {
    const { userId, type, status } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await PointTransaction.find(filter)
      .populate("userId", "userName email role points")
      .sort({ createdAt: -1 });

    res.json(successResponse(transactions, "Point transactions fetched successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await PointTransaction.findById(req.params.id).populate(
      "userId",
      "userName email role points",
    );

    if (!transaction) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    res.json(successResponse(transaction, "Point transaction fetched successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await PointTransaction.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    res.json(successResponse({ message: "Transaction deleted successfully" }, "Transaction deleted successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await PointTransaction.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!updated) {
      return res.status(404).json(errorResponse("Transaction not found"));
    }

    res.json(successResponse(updated, "Transaction status updated successfully"));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
