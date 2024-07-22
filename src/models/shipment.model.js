import { Schema, model } from "mongoose";

const shipmentSchema = new Schema({
  id: { type: String },
  from_user_id: { type: String },
  freight_price: { type: Number },
  carrier: { type: String },
  deliveryman: { type: String },
  name: { type: String },
  state: { type: String },
  city: { type: String },
  district: { type: String },
  street: { type: String },
  address: { type: String },
  complement: { type: String },
  number: { type: String },
  cep: { type: String },
  store: { type: String },
  url: { type: String },
  created: { type: Date, default: Date.now },
});

const Shipment = model("Shipment", shipmentSchema);

export default Shipment;
