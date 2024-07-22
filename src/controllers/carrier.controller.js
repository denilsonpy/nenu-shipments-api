import Carrier from "../models/carrier.model.js";
import { CarrierSchemaValidator } from "../validators/carrier.validator.js";

class CarrierController {
  static async get(req, res) {
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
      const carrier = await CarrierSchemaValidator.validate(
        {
          name,
          shipmentPrices,
        },
        { strict: true }
      );
      console.log(carrier);
      return res.json({ status: "ok" });
    } catch (err) {
      console.log(err);
      return res.json({ status: err });
    }
  }

  static async update() {}

  static async delete() {}
}

export default CarrierController;
