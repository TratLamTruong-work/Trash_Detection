import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(400).json({
      error:
        "Missing Authorization header. Expected format: 'Authorization: Bearer <token>'",
    });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      error:
        "Invalid Authorization header format. It should start with 'Bearer '",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userInfo = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token", message: error.message });
  }
};
