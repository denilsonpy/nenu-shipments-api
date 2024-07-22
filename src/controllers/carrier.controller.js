import yup from "yup";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import Carrier from "../models/carrier.model.js";
import { carrierSchema } from "../validators/carrier.validator.js";

class CarrierController {
  static async getAll(req, res) {
    const email = req.user;
    // Get all carriers linked to the user
    const carriers = await Carrier.find({
      user_email: email,
    });
    return res.json({ carriers });
  }

  static async create(req, res) {
    const email = req.user;
    const { name, shipmentPrices } = req.body;
    try {
      // Validate fields
      await carrierSchema.validate(
        {
          name,
          shipmentPrices,
        },
        { strict: true }
      );
      // Check if carrier already exists
      const carrierExists = await Carrier.findOne({
        user_email: email,
        name,
      });
      if (carrierExists) {
        return res.status(401).json({
          error:
            "A transportadora especificada já existe. Por favor, escolha um nome diferente ou edite a transportadora existente",
        });
      }
      // Create carrier
      const carrier = await Carrier.create({
        name,
        user_email: email,
        shipment_prices: shipmentPrices.map((s) => ({
          region_type: s.regionType,
          city: s.city,
          state: s.state,
          price: s.price,
        })),
      });
      await carrier.save();
      return res.json(carrier);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.json({ errors: error.errors });
      } else if (error instanceof mongoose.Error) {
        console.error("Error in MongoDB:", error.message);
        return res.sendStatus(500);
      } else {
        console.error("Error in update carrier:", error.message);
        return res.sendStatus(500);
      }
    }
  }

  static async updateById(req, res) {
    const email = req.user;
    const { id } = req.params;
    const { name, shipmentPrices } = req.body;
    try {
      // Validate fields
      await carrierSchema.validate(
        {
          name,
          shipmentPrices,
        },
        { strict: true }
      );
      // Check if new carrier name already exists
      const nameExists = await Carrier.findOne({
        user_email: email,
        name,
      });
      if (nameExists && nameExists._id != id) {
        return res.status(401).json({
          error:
            "A transportadora especificada já existe. Por favor, escolha um nome diferente.",
        });
      }
      // Check if carrier exists
      const updatedCarrier = await Carrier.findOneAndUpdate(
        {
          _id: id,
          user_email: email,
        },
        {
          name,
          shipment_prices: shipmentPrices.map((s) => ({
            region_type: s.regionType,
            city: s.city,
            state: s.state,
            price: s.price,
          })),
        },
        { new: true }
      );
      if (!updatedCarrier) return res.sendStatus(404);
      return res.json(updatedCarrier);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return res.json({ errors: error.errors });
      } else if (error instanceof mongoose.Error) {
        console.error("Error in MongoDB:", error.message);
        return res.sendStatus(500);
      } else {
        console.error("Error in update carrier:", error.message);
        return res.sendStatus(500);
      }
    }
  }

  static async deleteById(req, res) {
    const email = req.user;
    const { id } = req.params;
    // Check if carrier exists
    const carrierExists = await Carrier.findOne({
      user_email: email,
      _id: id,
    });
    if (!carrierExists) return res.sendStatus(404);
    await carrierExists.deleteOne();
    return res.sendStatus(200);
  }
}

export default CarrierController;
