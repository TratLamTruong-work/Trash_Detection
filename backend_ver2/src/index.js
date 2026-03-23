import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./lib/db.js";
import authenticationRoute from "./routes/authenticationRoute.js";
import usersRoute from "./routes/usersRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/api/auth", authenticationRoute);
app.use("/api/users", usersRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("Endpoint: http://localhost:" + PORT);
  connectDB();
});
