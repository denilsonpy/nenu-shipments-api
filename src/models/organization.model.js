import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
  name: String,
  description: String,
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
