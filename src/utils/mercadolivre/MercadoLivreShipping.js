import axios from "axios";
import config from "../../../config.js";

export class MercadoLivreShippingAPI {
  constructor(token) {
    this.token = token;
  }

  async getByID(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.meliAPiUrl}/shipments/${id}`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          // console.error("Error in getByID:", error);
          reject("Failed to get shipiment by id in Mercado Livre API");
        });
    });
  }
}
