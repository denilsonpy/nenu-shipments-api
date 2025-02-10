import mongoose, { Schema } from "mongoose";

const ShipmentPriceSchema = new mongoose.Schema({
  region_type: String,
  city: String,
  state: String,
  price: Number,
});

const carrierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // user_email: { type: String, required: true },
    organization_id: { type: Schema.Types.ObjectId, ref: "Organization" },
    shipment_prices: [ShipmentPriceSchema],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Carrier = mongoose.model("Carrier", carrierSchema);

export default Carrier;
