import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      state: 0,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(401).json({
      state: 0,
      error: error.message,
      message: "Invalid token",
    });
  }
};

export const verifyAdmin = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({
      state: 0,
      message: "Access denied",
    });
  }

  next();
};