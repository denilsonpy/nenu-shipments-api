import { format } from "date-fns";
import Account from "../models/account.model.js";
import Shipment from "../models/shipment.model.js";
import { sendEmail } from "../utils/mail.js";
import { MercadoLivreShippingAPI } from "../utils/mercadolivre/MercadoLivreShipping.js";
import { checkFreightPrice } from "../utils/utils.js";
import Carrier from "../models/carrier.model.js";

class ShippingController {
  static async getById(req, res) {
    const email = req.user;
    const { id } = req.params;

    const accounts = await Account.find({
      email: {
        $in: [email],
      },
    });

    for (let account of accounts) {
      const token = account.access_token;
      const mercadolivreShippingApi = new MercadoLivreShippingAPI(token);
      try {
        const shippingExists = await mercadolivreShippingApi.getByID(id);
        const receiver = shippingExists?.receiver_address;
        return res.json({
          shipping: {
            id: shippingExists.id,
            // cpf_cnpj: shippingExists.,
            name: receiver?.receiver_name,
            state: receiver?.state?.name,
            city: receiver?.city?.name,
            district: receiver?.neighborhood?.name,
            street: receiver?.street_name,
            address: receiver?.address_line,
            complement: receiver?.comment,
            number: receiver?.street_number,
            cep: receiver?.zip_code,
            store: account.name,
            url: `https://www.mercadolivre.com.br/vendas/${shippingExists?.order_id}/detalhe`,
            created: shippingExists?.date_created,
          },
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    return res.sendStatus(404);
  }

  static async create(req, res) {
    // Save Data on Database and Google Docs
    const email = req.user;
    const carrierId = req?.body?.carrierId;
    const deliveryman = req?.body?.deliveryman;
    const shipments = req?.body?.shipments;

    const carrier = await Carrier.findOne({
      _id: carrierId,
      user_email: email,
    });
    if (!carrier) {
      return res.status(401).json({
        error:
          "Não foi possível encontrar a transportadora especificada. Verifique se o nome está correto ou se a transportadora está cadastrada no sistema.",
      });
    }

    const accounts = await Account.find({
      email: {
        $in: [email],
      },
    });

    const createdShipments = [];
    for (let shipment of shipments) {
      for (let account of accounts) {
        const token = account.access_token;
        const mercadolivreShippingApi = new MercadoLivreShippingAPI(token);
        try {
          const shippingExists = await mercadolivreShippingApi.getByID(
            shipment
          );
          const receiver = shippingExists?.receiver_address;
          const rules = carrier.shipment_prices.map((rule) => rule._doc);
          const freightPrice = checkFreightPrice(rules, {
            state: receiver?.state?.name,
            city: receiver?.city?.name,
          });
          const shipping = {
            id: shippingExists.id,
            carrier: carrier.name,
            deliveryman,
            from_user_id: email,
            name: receiver?.receiver_name,
            state: receiver?.state?.name,
            city: receiver?.city?.name,
            district: receiver?.neighborhood?.name,
            street: receiver?.street_name,
            address: receiver?.address_line,
            complement: receiver?.comment,
            number: receiver?.street_number,
            cep: receiver?.zip_code,
            store: account.name,
            freight_price: freightPrice,
            url: `https://www.mercadolivre.com.br/vendas/${shippingExists?.order_id}/detalhe`,
          };
          createdShipments.push(shipping);
          await Shipment.insertMany([shipping]);
        } catch (error) {
          continue;
        }
      }
    }

    sendEmail(
      createdShipments.map((s) => ({
        ...s,
        created: format(new Date(), "dd/MM/yyyy HH:mm"),
      }))
    );
    return res.sendStatus(201);
  }

  static async getAll(req, res) {
    const email = req.user;

    const { shipment_id, daterange_from, daterange_to, carrier, deliveryman } =
      req.query;

    const query = {
      from_user_id: { $in: [email] },
    };

    // Add filters based on the presence of query parameters
    if (shipment_id) {
      query.id = shipment_id;
    }

    if (daterange_from && daterange_to) {
      query.created = {
        $gte: new Date(daterange_from),
        $lte: new Date(daterange_to),
      };
    } else if (daterange_from) {
      query.created = { $gte: new Date(daterange_from) };
    } else if (daterange_to) {
      query.created = { $lte: new Date(daterange_to) };
    }

    if (carrier) {
      query.carrier = carrier;
    }

    if (deliveryman) {
      query.deliveryman = deliveryman;
    }

    const shipments = await Shipment.find(query);

    return res.json({ shipments });
  }
}

export default ShippingController;
