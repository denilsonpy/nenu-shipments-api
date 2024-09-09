import express from "express";
import mongoose from "mongoose";
import cors from "cors";
// Config
import config from "../config.js";
// Routers
import shipmentRouter from "./routes/shipment.router.js";
import authRouter from "./routes/auth.router.js";
import accountRouter from "./routes/account.router.js";
// Middlewares
import { refreshAccountToken } from "./middlewares/account.middleware.js";
import { authenticated } from "./middlewares/auth.middleware.js";
import carrierRouter from "./routes/carrier.router.js";
import notificationRouter from "./routes/notification.router.js";

// Connection with database
mongoose.connect(config.mongoUri || "");
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Mongo database connected!");
});

const app = express();

app.use(cors());
app.use(express.json());

// Add middleware and other routes as needed
app.use("/auth", authRouter);
app.use("/notifications", notificationRouter);
app.use("/accounts", authenticated, accountRouter);
app.use("/shipments", authenticated, refreshAccountToken, shipmentRouter);
app.use("/carriers", authenticated, carrierRouter);

// Handle other endpoints or invalid requests
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Handle internal server errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Main function to run tasks before starting the server
app.listen(config.port, () => {
  console.log(
    `🚀 Server running!\nReady to process questions like a boss. 💪🔥`
  );
});
