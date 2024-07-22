import mongoose from "mongoose";

const ShipmentPriceSchema = new mongoose.Schema({
  tag: String,
  price: Number,
});

const carrierSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    user_email: { type: String, required: true },
    shipment_prices: [ShipmentPriceSchema],
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
  {
    _id: false,
  }
);

const Carrier = mongoose.model("Carrier", carrierSchema);

export default Carrier;
