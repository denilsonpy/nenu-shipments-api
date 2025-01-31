import moment from "moment";
import Package from "../models/package.model.js";
import Shipment from "../models/shipment.model.js";

class PackageController {
  static async getShipped(req, res) {
    try {
      const email = req.user;
      if (!email) {
        return res.status(400).json({ error: "User email is required." });
      }

      const { date } = req.query;
      const query = {
        user_email: email,
        mode: "me2",
        logistic_type: "self_service",
      };

      // Validate and create date range filters
      let daterangeFrom, daterangeTo;
      if (date) {
        daterangeFrom = moment(date).startOf("day").toISOString();
        daterangeTo = moment(date).add(1, "day").startOf("day").toISOString();

        if (
          isNaN(Date.parse(daterangeFrom)) ||
          isNaN(Date.parse(daterangeTo))
        ) {
          return res.status(400).json({ error: "Invalid date range format." });
        }

        query["status_history.date_shipped"] = {
          $gte: daterangeFrom,
          $lte: daterangeTo,
        };
      }

      // Fetch packages based on the query
      const packages = await Package.find(query);
      const packageIds = packages.map((pkg) => pkg.id);

      // Fetch shipment status for packages
      const shipments = await Shipment.find({ id: { $in: packageIds } });
      const shipmentIds = new Set(shipments.map((shipment) => shipment.id));

      const formattedPackages = packages.map((p) => ({
        id: p.id,
        name: p?.receiver_address?.receiver_name,
        state: p?.receiver_address?.state?.name,
        city: p?.receiver_address?.city?.name,
        district: p?.receiver_address?.neighborhood?.name,
        street: p?.receiver_address?.street_name,
        address: p?.receiver_address?.address_line,
        complement: p?.receiver_address?.comment,
        number: p?.receiver_address?.street_number,
        cep: p?.receiver_address?.zip_code,
        status: p?.status,
        url: `https://www.mercadolivre.com.br/vendas/${p?.order_id}/detalhe`,
        is_being_tracked: shipmentIds.has(p.id),
      }));

      return res.json({ packages: formattedPackages });
    } catch (error) {
      console.error("Error fetching packages:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default PackageController;
