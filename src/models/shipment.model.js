import { Schema, model } from "mongoose";

const shipmentSchema = new Schema(
  {
    id: { type: String },
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
    organization_id: { type: Schema.Types.ObjectId, ref: "Organization" },
    is_deleted: { type: Boolean, default: false },
    deleted_by: { type: String, default: null },
  },
  {
    timestamps: {
      createdAt: "created", // 👈 rename createdAt → created
      updatedAt: "updated", // 👈 rename updatedAt → updated
    },
  }
);

const Shipment = model("Shipment", shipmentSchema);

export default Shipment;
