import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fileUpload from "express-fileupload";

import { connectDB } from "./lib/db.js";
import authenticationRoute from "./routes/authenticationRoute.js";
import usersRoute from "./routes/usersRoute.js";
import itemsRoute from "./routes/itemsRoute.js";
import tradeHistoryRoute from "./routes/tradeHistoryRoute.js";

dotenv.config();

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    parseNonFileFields: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  }),
);

// Health Check - Root Route
app.get("/", (req, res) => {
  res.json({
    message: "Trash Detection API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      items: "/api/items",
      tradeHistory: "/api/trade_history",
    },
  });
});

// Routes
app.use("/api/auth", authenticationRoute);
app.use("/api/users", usersRoute);
app.use("/api/items", itemsRoute);
app.use("/api/trade_history", tradeHistoryRoute);

// 404 Handler - Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Endpoint: http://localhost:" + PORT);
  connectDB();
});
