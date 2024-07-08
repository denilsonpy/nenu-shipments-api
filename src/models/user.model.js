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
    minLength: 8,
    select: false,
  },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
