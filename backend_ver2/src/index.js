import express from "express";
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
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  }),
);

// Routes
app.use("/api/auth", authenticationRoute);
app.use("/api/users", usersRoute);
app.use("/api/items", itemsRoute);
app.use("/api/trade_history", tradeHistoryRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Endpoint: http://localhost:" + PORT);
  connectDB();
});
