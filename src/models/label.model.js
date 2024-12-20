import mongoose from "mongoose";

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
  },
  { strict: false, versionKey: false }
);

const Label = mongoose.model("Label", labelSchema);

export default Label;
