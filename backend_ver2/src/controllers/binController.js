import TrashBin from "../models/TrashBin.js";
import TrashBinLog from "../models/TrashBinLog.js";

export const receiveBinStatus = async (req, res) => {
  try {
    const {
      binType,
      fillPercent,
      timestamp,
    } = req.body;

    if (
      !binType ||
      fillPercent === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    let status = "empty";

    if (fillPercent >= 90) {
      status = "full";
    } else if (fillPercent >= 70) {
      status = "warning";
    } else if (fillPercent > 0) {
      status = "normal";
    }

    // cập nhật realtime
    const updatedBin =
      await TrashBin.findOneAndUpdate(
        { binType },
        {
          currentFillPercent: fillPercent,
          status,
          lastUpdated: new Date(),
        },
        {
          new: true,
          upsert: true,
        }
      );

    // lưu lịch sử
    await TrashBinLog.create({
      binType,
      fillPercent,
      timestamp,
    });

    return res.status(200).json({
      success: true,
      data: updatedBin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCurrentBins = async (req, res) => {
  try {
    const bins = await TrashBin.find();

    return res.status(200).json({
      success: true,
      data: bins,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};