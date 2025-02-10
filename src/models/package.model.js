import mongoose, { Schema } from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    _id: {
      type: String, // Change this to `Number` if your IDs are numeric
      required: true,
    },
    organization_id: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { strict: false, versionKey: false }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
