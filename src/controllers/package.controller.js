import moment from "moment";
import Package from "../models/package.model.js";
import Shipment from "../models/shipment.model.js";
import Account from "../models/account.model.js";

class PackageController {
  static async getPending(req, res) {
    try {
      const user = req.user;

      const { daterange_from, daterange_to } = req.query;

      const accounts = await Account.find({
        organization_id: user.organization,
      });

      const query = {
        organization_id: user.organization,
        mode: "me2",
        logistic_type: "self_service",
      };

      if (daterange_from && daterange_to) {
        const startDate = new Date(daterange_from);
        const endDate = new Date(daterange_to);
        const endOfDay = new Date(endDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query["status_history.date_shipped"] = {
          $gte: String(startDate.toISOString()), // Data inicial (início do dia)
          $lte: String(endOfDay.toISOString()), // Data final (final do dia)
        };
      } else if (daterange_from) {
        const startDate = new Date(daterange_from);
        query["status_history.date_shipped"] = {
          $gte: String(startDate.toISOString()),
        };
      } else if (daterange_to) {
        const endOfDay = new Date(daterange_to);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query["status_history.date_shipped"] = {
          $lte: String(endOfDay.toISOString()),
        };
      }

      // Fetch packages based on the query
      let packages = await Package.find(query);
      const packageIds = packages.map((pkg) => pkg.id);

      // Fetch shipment status for packages
      const shipments = await Shipment.find({ id: { $in: packageIds } });
      const shippedPackageIds = shipments.map((shipment) => shipment.id);

      // Filter out packages that have not been shipped
      let pendingPackages = packages.filter((pkg) => {
        return !shippedPackageIds.includes(pkg._id);
      });

      const formattedPackages = pendingPackages.map((p) => ({
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
        shipping_items: p?.shipping_items.length,
        store: accounts.find((account) => account.seller_id === p.sender_id)
          .name,
        url: `https://www.mercadolivre.com.br/vendas/${p?.order_id}/detalhe`,
        created: p.status_history.date_shipped,
      }));

      return res.json({ packages: formattedPackages });
    } catch (error) {
      console.error("Error fetching packages:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default PackageController;
