import config from "../../config.js";
import Account from "../models/account.model.js";
import Label from "../models/label.model.js";
import Package from "../models/package.model.js";
import { sendEmail, sendMail } from "../utils/mail.js";
import { MercadoLivreNotificationAPI } from "../utils/mercadolivre/MercadoLivreNotification.js";
import { MercadoLivreShippingAPI } from "../utils/mercadolivre/MercadoLivreShipping.js";

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
          const mercadoLivreShippingAPI = new MercadoLivreShippingAPI(
            account.access_token
          );

          const data = await mercadoLivreNotificationAPI.getByResource(
            resource
          );

          const packageId = data.id;

          // Find the package by id and update it if exists, otherwise insert a new package
          await Package.findOneAndUpdate(
            { _id: packageId }, // Filter to find the package by id
            { $set: { ...data, organization_id: account.organization_id } }, // Update the package with the new data
            { upsert: true, new: true } // Create the package if it doesn't exist (upsert)
          );

          // Save label
          if (data.status === "ready_to_ship" && data.substatus === "printed") {
            const labelContent = await mercadoLivreShippingAPI.getZplByID(
              packageId
            );
            const label = new Label({
              packageId,
              label: labelContent,
              organization_id: account.organization_id,
            });
            await label.save();
          }

          const excludedStatuses = [
            "ready_to_ship",
            "shipped",
            "delivered",
            "handling",
            "pending",
          ];

          if (
            data.logistic_type === "self_service" &&
            !excludedStatuses.includes(data.status)
          ) {
            sendMail(
              "Teste",
              `${data.id} - ${data.status}`,
              "contato.denilsonsilva@gmail.com"
            );
          }

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
