import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

class CarrierController {
  static async getAll(req, res) {
    const user = req.user;
    // Get all carriers linked to the user
    const users = await User.find({
      organization: user.organization,
    });
    return res.json({ users });
  }

  static async create(req, res) {
    const user = req.user;
    // Get email and password
    const { name, email, password, permission } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "Invalid data." });
    }
    try {
      // User already exists?
      const userExists = await User.findOne({
        email,
        organization: user.organization,
      });
      if (userExists) {
        return res.status(400).json({ error: "Email already registered." });
      }

      // Create password hash
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      // Create user
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        permission,
        organization: user.organization,
      });

      const userToSave = await newUser.save();
      res.status(200).json({
        _id: userToSave._id,
        name: userToSave.name,
        email: userToSave.email,
        permission: user.permission,
        organization: user.organization,
        created: userToSave.created,
        updated: userToSave.updated,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // static async updateById(req, res) {
  //   const user = req.user;
  //   const { id } = req.params;
  //   const { name, shipment_prices } = req.body;
  //   try {
  //     // Validate fields
  //     await carrierSchema.validate(
  //       {
  //         name,
  //         shipment_prices,
  //       },
  //       { strict: true }
  //     );
  //     // Check if new carrier name already exists
  //     const nameExists = await Carrier.findOne({
  //       organization_id: user.organization,
  //       name,
  //     });
  //     if (nameExists && nameExists._id != id) {
  //       return res.status(401).json({
  //         error:
  //           "A transportadora especificada já existe. Por favor, escolha um nome diferente.",
  //       });
  //     }
  //     // Check if carrier exists
  //     const updatedCarrier = await Carrier.findOneAndUpdate(
  //       {
  //         _id: id,
  //         organization_id: user.organization,
  //       },
  //       {
  //         name,
  //         shipment_prices: shipment_prices.map((s) => ({
  //           region_type: s.regionType,
  //           city: s.city,
  //           state: s.state,
  //           price: s.price,
  //         })),
  //       },
  //       { new: true }
  //     );
  //     if (!updatedCarrier) return res.sendStatus(404);
  //     return res.json(updatedCarrier);
  //   } catch (error) {
  //     if (error instanceof yup.ValidationError) {
  //       return res.json({ errors: error.errors });
  //     } else if (error instanceof mongoose.Error) {
  //       console.error("Error in MongoDB:", error.message);
  //       return res.sendStatus(500);
  //     } else {
  //       console.error("Error in update carrier:", error.message);
  //       return res.sendStatus(500);
  //     }
  //   }
  // }

  static async deleteById(req, res) {
    const user = req.user;
    const { id } = req.params;
    if (user.id === id) return res.sendStatus(401);
    // Check if user exists
    const userExists = await User.findOne({
      organization: user.organization,
      _id: id,
    });
    if (!userExists || userExists.permission === "admin")
      return res.sendStatus(404);
    await userExists.deleteOne();
    return res.sendStatus(200);
  }
}

export default CarrierController;
