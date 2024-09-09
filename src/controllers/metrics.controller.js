import yup from "yup";
import mongoose from "mongoose";
import Carrier from "../models/carrier.model.js";
import Shipment from "../models/shipment.model.js";
import { carrierSchema } from "../validators/carrier.validator.js";

class MetricsController {
  static async getLatestRecords(req, res) {
    const email = req.user;
    return res.json({ email });
  }

  static async getQuantityByCarrier(req, res) {
    const email = req.user;
    return res.json({ email });
  }

  static async getResume(req, res) {
    const email = req.user;
    const shipments = await Shipment.find();
    const total = shipments.length;
    const amount_spend = shipments.reduce((acc, curr) => {
      return acc + (curr.freight_price || 0);
    }, 0);
    return res.json({ email, amount_spend: Math.round(amount_spend), total });
  }
}

export default MetricsController;
