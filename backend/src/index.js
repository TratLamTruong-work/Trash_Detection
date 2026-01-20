import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import rewardRoute from "./routes/rewardRoute.js";
import qrRoute from "./routes/qrRoute.js";
import customItemRoute from "./routes/customItemRoute.js";
import defaultItemRoute from "./routes/defaultItemRoute.js";
import groupRoute from "./routes/groupRoute.js";
import groupMemberRoute from "./routes/groupMemberRoute.js";
import customTradeHistoryRoute from "./routes/customTradeHistoryRoute.js";
import tradeHistoryRoute from "./routes/tradeHistoryRoute.js";
import { connectDB } from "./lib/connectDB.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/rewards", rewardRoute);
app.use("/api/qr", qrRoute);
app.use("/api/custom-items", customItemRoute);
app.use("/api/default-items", defaultItemRoute);
app.use("/api/groups", groupRoute);
app.use("/api/group-members", groupMemberRoute);
app.use("/api/custom-trade-history", customTradeHistoryRoute);
app.use("/api/trade-history", tradeHistoryRoute);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server đang chạy tốt!" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server đang chạy tại port ${port}`);
  connectDB();
});
