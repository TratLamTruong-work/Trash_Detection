import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import TradeHistory from "../models/tradeHistoryModel.js";
import User from "../models/userModel.js";
import DefaultItem from "../models/defaultItemModel.js";

export const createTradeHistory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, itemId, quantity } = req.body;

    // 1. Validate input
    if (!userId || !itemId || !quantity) {
      return res.status(400).json({
        state: 0,
        message: "userId, itemId, and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        state: 0,
        message: "Quantity must be greater than 0",
      });
    }

    // 2. Get user & item
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        state: 0,
        message: "User not found",
      });
    }

    const item = await DefaultItem.findById(itemId).session(session);
    if (!item) {
      await session.abortTransaction();
      return res.status(404).json({
        state: 0,
        message: "Item not found",
      });
    }

    // 3. Calculate points
    const previousPoint = user.point;
    const totalCost = item.pointToTrade * quantity;
    const remainedPoint = previousPoint - totalCost;

    // 4. Check enough points
    if (remainedPoint < 0) {
      await session.abortTransaction();
      return res.status(400).json({
        state: 0,
        message: "Not enough points to trade",
      });
    }

    // 5. Update user point
    user.point = remainedPoint;
    await user.save({ session });

    // 6. Create trade history
    const newTradeHistory = await TradeHistory.create(
      [
        {
          userId,
          itemId,
          quantity,
          previousPoint,
          remainedPoint,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      state: 1,
      data: newTradeHistory[0],
      message: "Trade item successful",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Create trade history failed",
    });
  }
};

export const getAllTradeHistories = async (req, res) => {
  try {
    const tradeHistories = await TradeHistory.find()
      .populate("userId", "username email")
      .populate("itemId", "name pointToTrade imageUrl")
      .sort({ createdAt: -1 });

    const formattedTradeHistories = tradeHistories.map((trade) => ({
      _id: trade._id,
      user: trade.userId
        ? {
            _id: trade.userId._id,
            username: trade.userId.username,
            email: trade.userId.email,
          }
        : null,
      item: trade.itemId
        ? {
            _id: trade.itemId._id,
            name: trade.itemId.name,
            pointToTrade: trade.itemId.pointToTrade,
            imageUrl: trade.itemId.imageUrl,
          }
        : null,
      quantity: trade.quantity,
      previousPoint: trade.previousPoint,
      remainedPoint: trade.remainedPoint,
      createdAt: trade.createdAt,
      updatedAt: trade.updatedAt,
    }));

    res.status(200).json({
      state: 1,
      data: formattedTradeHistories,
      message: "Get all trade histories successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Get all trade histories failed",
    });
  }
};

export const deleteTradeHistory = async (req, res) => {
  try {
    if (process.env.STAGE === "production") {
      return res.status(403).json({
        state: 0,
        message: "This API is not allowed in production",
      });
    }

    const { id } = req.params;

    const trade = await TradeHistory.findById(id);

    if (!trade) {
      return res.status(404).json({
        state: 0,
        message: "Trade history not found",
      });
    }

    await TradeHistory.deleteOne({ _id: id });

    res.status(200).json({
      state: 1,
      message: "Delete trade history (DEV) successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Delete trade history (DEV) failed",
    });
  }
};

export const deleteAllTradeHistories = async (req, res) => {
  try {
    if (process.env.STAGE === "production") {
      return res.status(403).json({
        state: 0,
        message: "This API is not allowed in production",
      });
    }

    const result = await TradeHistory.deleteMany({});

    res.status(200).json({
      state: 1,
      data: {
        deletedCount: result.deletedCount,
      },
      message: "Delete all trade histories (DEV) successful",
    });
  } catch (error) {
    res.status(500).json({
      state: 0,
      error: error.message,
      message: "Delete all trade histories (DEV) failed",
    });
  }
};
