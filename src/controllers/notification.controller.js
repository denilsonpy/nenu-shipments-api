import config from "../../config.js";
import Account from "../models/account.model.js";
import Package from "../models/package.model.js";
import { MercadoLivreNotificationAPI } from "../utils/mercadolivre/MercadoLivreNotification.js";

class NotificationController {
  static async notify(req, res) {
    try {
      const { topic, resource, user_id } = req.body;

      switch (topic) {
        case "shipments": {
          const account = await Account.findOne({
            seller_id: user_id,
          });

          const mercadoLivreNotificationAPI = new MercadoLivreNotificationAPI(
            account.access_token
          );

          const data = await mercadoLivreNotificationAPI.getByResource(
            resource
          );

          const excludedStatuses = ["ready_to_ship", "shipped", "delivered"];

          if (data.logistic_type === "self_service" && !excludedStatuses.includes(data.status)) {
            console.log(data);
          }

          const packageId = data.id;

          // Find the package by id and update it if exists, otherwise insert a new package
          await Package.findOneAndUpdate(
            { _id: packageId }, // Filter to find the package by id
            { $set: { ...data, user_email: account.email } }, // Update the package with the new data
            { upsert: true, new: true } // Create the package if it doesn't exist (upsert)
          );

          return res.sendStatus(200);
        }
        default:
          return res.sendStatus(200);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default NotificationController;
