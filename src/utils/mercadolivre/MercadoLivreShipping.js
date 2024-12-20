import axios from "axios";
import AdmZip from "adm-zip";
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
          reject("Failed to get shipment by id in Mercado Livre API");
        });
    });
  }

  async getZplByID(id) {
    try {
      // Fetch the shipment label ZIP from the API
      const response = await axios.get(
        `https://api.mercadolibre.com/shipment_labels?shipment_ids=${id}&response_type=zpl2`,
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      );

      // Load the ZIP content
      const zip = new AdmZip(response.data);
      const zipEntries = zip.getEntries();

      // Locate the specific file
      const labelFile = zipEntries.find(
        (entry) => entry.entryName === "Etiqueta de envio.txt"
      );

      if (labelFile) {
        // Extract and return the content of the file
        return labelFile.getData().toString("utf8");
      } else {
        // Return null if the file is not found
        return null;
      }
    } catch (error) {
      // Log and propagate the error
      console.error("Error fetching or processing shipment label:", error);
      throw new Error("Failed to retrieve or process the shipment label.");
    }
  }
}
