import yup from "yup";
import mongoose from "mongoose";
import { randomUUID } from "crypto";
import Carrier from "../models/carrier.model.js";
import { carrierSchema } from "../validators/carrier.validator.js";

class CarrierController {
  static async getAll(req, res) {
    const user = req.user;
    // Get all carriers linked to the user
    const carriers = await Carrier.find({
      organization_id: user.organization,
    });
    return res.json({ carriers });
  }

  static async getById(req, res) {
    const user = req.user;
    const { id } = req.params;
    // Check if carrier exists
    const carrier = await Carrier.findOne({
      _id: id,
      organization_id: user.organization,
    });
    return res.json(carrier);
  }

  static async create(req, res) {
    const user = req.user;
    const { name, shipment_prices } = req.body;
    try {
      // Validate fields
      await carrierSchema.validate(
        {
          name,
          shipment_prices,
        },
        { strict: true }
      );
      // Check if carrier already exists
      const carrierExists = await Carrier.findOne({
        organization_id: user.organization,
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
        organization_id: user.organization,
        shipment_prices,
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
    const user = req.user;
    const { id } = req.params;
    const { name, shipment_prices } = req.body;
    try {
      // Validate fields
      await carrierSchema.validate(
        {
          name,
          shipment_prices,
        },
        { strict: true }
      );
      // Check if new carrier name already exists
      const nameExists = await Carrier.findOne({
        organization_id: user.organization,
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
          organization_id: user.organization,
        },
        {
          name,
          shipment_prices: shipment_prices.map((s) => ({
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
    const user = req.user;
    const { id } = req.params;
    // Check if carrier exists
    const carrierExists = await Carrier.findOne({
      organization_id: user.organization,
      _id: id,
    });
    if (!carrierExists) return res.sendStatus(404);
    await carrierExists.deleteOne();
    return res.sendStatus(200);
  }
}

export default CarrierController;
