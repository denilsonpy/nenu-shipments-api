import mongoose from "mongoose";
import Shipment from "./src/models/shipment.model.js"
import config from "./config.js";
import Package from "./src/models/package.model.js";

// Connection with database
mongoose.connect(config.mongoUri || "");
const database = mongoose.connection;

database.on("error", (error) => {
    console.log(error);
});

database.once("connected", () => {
    console.log("Mongo database connected!");
});


const excludedStatuses = ["ready_to_ship", "shipped", "delivered"];; // Example excluded statuses
const data = await Package.find({
    logistic_type: "self_service",
    status: { $nin: excludedStatuses } // Exclude specified statuses
})

// console.log(data)
// Send emails for each document found
data.forEach(item => {
    console.log(item.status)
});

// handling, pending, cancelled