export const receiveDistance = async (req, res) => {
  try {
    const { binType, fillPercent, timestamp } = req.body;

    if (
      binType === undefined ||
      fillPercent === undefined ||
      timestamp === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    console.log("Bin Type:", binType);
    console.log("Fill Percent:", fillPercent);
    console.log("Timestamp:", timestamp);

    return res.status(200).json({
      success: true,
      message: "Data received successfully",
      data: {
        binType,
        fillPercent,
        timestamp,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};