import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  email: { type: String },
  token: {
    required: true,
    type: String,
    index: true,
    unique: true,
  },
  created: { type: Date, default: Date.now },
  expires: { type: Date },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
