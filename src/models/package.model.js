import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Change this to `Number` if your IDs are numeric
      required: true,
    },
  },
  { strict: false, versionKey: false }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
