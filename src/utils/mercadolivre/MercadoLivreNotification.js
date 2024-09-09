import axios from "axios";
import config from "../../../config.js";

export class MercadoLivreNotificationAPI {
  constructor(token) {
    this.token = token;
  }

  async getByResource(resource) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.meliAPiUrl}${resource}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject("Failed to get resource in Mercado Livre API");
        });
    });
  }
}
