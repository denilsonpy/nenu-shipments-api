import config from "../../config.js";
import Account from "../models/account.model.js";
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

          console.log(`${config.meliAPiUrl}${resource}`);
          const data = await mercadoLivreNotificationAPI.getByResource(
            resource
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
