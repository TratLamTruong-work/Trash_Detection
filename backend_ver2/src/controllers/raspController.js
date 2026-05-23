export const receiveDistance = async (req, res) => {
  try {
    const { distance } = req.body;

    if (distance === undefined) {
      return res.status(400).json({
        success: false,
        message: "Distance is required",
      });
    }

    console.log("Distance received:", distance);

    return res.status(200).json({
      success: true,
      message: "Distance received successfully",
      data: {
        distance,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};