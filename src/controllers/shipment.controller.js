import Account from "../models/account.model.js";
import Shipment from "../models/shipment.model.js";
import { MercadoLivreAccountAPI } from "../utils/mercadolivre/MercadoLivreAccount.js";
import { MercadoLivreShippingAPI } from "../utils/mercadolivre/MercadoLivreShipping.js";

class ShippingController {
  static async getCarriers(req, res) {
    return res.json({
      carriers: [
        "J3",
        "MG Log",
        "E-Express",
        "Flex Mania",
        "Ricardo",
        "Pedro",
        "Lucas",
      ],
    });
  }

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
    const carrier = req?.body?.carrier;
    const deliveryman = req?.body?.deliveryman;
    const shipments = req?.body?.shipments;
    const accounts = await Account.find({
      email: {
        $in: [email],
      },
    });

    for (let shipment of shipments) {
      for (let account of accounts) {
        const token = account.access_token;
        const mercadolivreShippingApi = new MercadoLivreShippingAPI(token);
        try {
          const shippingExists = await mercadolivreShippingApi.getByID(
            shipment
          );
          const receiver = shippingExists?.receiver_address;
          const shipping = {
            id: shippingExists.id,
            // cpf_cnpj: shippingExists.,
            carrier,
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
            url: `https://www.mercadolivre.com.br/vendas/${shippingExists?.order_id}/detalhe`,
            created: shippingExists?.date_created,
          };
          await Shipment.insertMany([shipping]);
        } catch (error) {
          continue;
        }
      }
    }

    return res.sendStatus(201);
  }

  static async find(req, res) {
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
      query.created_at = {
        $gte: new Date(daterange_from),
        $lte: new Date(daterange_to),
      };
    } else if (daterange_from) {
      query.createdAt = { $gte: new Date(daterange_from) };
    } else if (daterange_to) {
      query.createdAt = { $lte: new Date(daterange_to) };
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
