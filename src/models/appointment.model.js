import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
  id: { type: String },
  user_email: { type: String },
  shipments: { type: [Number] },
  operator: { type: String },
  created: { type: Date, default: Date.now },
});

const Appointment = model("Appointment", appointmentSchema);

export default Appointment;
