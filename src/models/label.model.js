import mongoose, { Schema } from "mongoose";

const labelSchema = new mongoose.Schema(
  {
    packageId: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    organization_id: { type: Schema.Types.ObjectId, ref: "Organization" },
  },
  { strict: false, versionKey: false }
);

const Label = mongoose.model("Label", labelSchema);

export default Label;
