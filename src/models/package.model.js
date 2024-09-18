import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {},
  { strict: false, versionKey: false }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
