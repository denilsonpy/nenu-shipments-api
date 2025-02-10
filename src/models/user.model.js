import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    required: true,
    type: String,
    index: true,
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
  permission: {
    type: String,
    enum: ["read", "write", "admin"],
    required: true,
  },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
