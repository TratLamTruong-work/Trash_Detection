import DefaultItem from "../schemas/defaultItem.js";
import TradeHistory from "../schemas/tradeHistory.js";
import User from "../schemas/user.js";

export const getAllRewards = async (req, res) => {
  try {
    const rewards = await DefaultItem.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: rewards,
    });
  } catch (error) {
    console.error("Error in getAllRewards:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách phần thưởng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getRewardById = async (req, res) => {
  try {
    const { id } = req.params;

    const reward = await DefaultItem.findById(id);

    if (!reward) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phần thưởng"
      });
    }

    res.json({
      success: true,
      data: reward,
    });
  } catch (error) {
    console.error("Error in getRewardById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy thông tin phần thưởng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const tradeReward = async (req, res) => {
  try {
    const userId = req.userInfo.id;
    const { itemId, quantity = 1 } = req.body;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn phần thưởng để đổi"
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải lớn hơn 0"
      });
    }

    const user = await User.findById(userId);
    const item = await DefaultItem.findById(itemId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng"
      });
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy phần thưởng"
      });
    }

    const totalPointsNeeded = item.pointToTrade * quantity;

    if (user.points < totalPointsNeeded) {
      return res.status(400).json({
        success: false,
        message: `Không đủ điểm. Bạn cần ${totalPointsNeeded} điểm nhưng chỉ có ${user.points} điểm`
      });
    }

    const prevPoint = user.points;

    user.points -= totalPointsNeeded;
    await user.save();

    const tradeHistory = new TradeHistory({
      userId: user._id,
      itemId: item._id,
      itemName: item.name,
      quantity,
      pointsSpent: totalPointsNeeded,
      prevPoint,
      remainPoint: user.points,
    });

    await tradeHistory.save();

    res.json({
      success: true,
      message: "Đổi thưởng thành công",
      data: {
        itemName: item.name,
        quantity,
        pointsSpent: totalPointsNeeded,
        remainingPoints: user.points,
        tradeId: tradeHistory._id,
      },
    });
  } catch (error) {
    console.error("Error in tradeReward:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi đổi thưởng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getTradeHistory = async (req, res) => {
  try {
    const userId = req.userInfo.id;

    const history = await TradeHistory.find({ userId })
      .populate("itemId", "name imageUrl pointToTrade")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error in getTradeHistory:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử đổi thưởng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
