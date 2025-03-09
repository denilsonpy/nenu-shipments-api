import { format } from "date-fns";
import Account from "../models/account.model.js";
import Shipment from "../models/shipment.model.js";
import { sendEmail } from "../utils/mail.js";
import { MercadoLivreShippingAPI } from "../utils/mercadolivre/MercadoLivreShipping.js";
import { checkFreightPrice } from "../utils/utils.js";
import Carrier from "../models/carrier.model.js";
import Appointment from "../models/appointment.model.js";
import Package from "../models/package.model.js";

class ShippingController {
  static async getById(req, res) {
    // try {
    const user = req.user;
    const { id } = req.params;

    // const pack = await Package.findOne({
    //   _id: id,
    //   organization_id: user.organization,
    // });
    const accounts = await Account.find({
      organization_id: user.organization,
    });

    for (let account of accounts) {
      const token = account.access_token;
      const mercadolivreShippingApi = new MercadoLivreShippingAPI(token);
      try {
        const shippingExists = await mercadolivreShippingApi.getByID(id);
        const receiver = shippingExists?.receiver_address;
        return res.json({
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
        });
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    //   return res.json({
    //     id: pack._id,
    //     name: pack.receiver_address?.receiver_name,
    //     state: pack.receiver_address?.state?.name,
    //     city: pack.receiver_address?.city?.name,
    //     district: pack.receiver_address?.neighborhood?.name,
    //     street: pack.receiver_address?.street_name,
    //     address: pack.receiver_address?.address_line,
    //     complement: pack.receiver_address?.comment,
    //     number: pack.receiver_address?.street_number,
    //     cep: pack.receiver_address?.zip_code,
    //     store: account.name,
    //     url: `https://www.mercadolivre.com.br/vendas/${pack?.order_id}/detalhe`,
    //     created: pack?.date_created,
    //   });
    // } catch (error) {
    //   console.log(error);
    //   return res.sendStatus(500);
    // }
  }

  static async create(req, res) {
    // Save Data on Database and Google Docs
    const user = req.user;
    const carrierId = req?.body?.carrier_id;
    const deliveryman = req?.body?.deliveryman;
    const shipments = req?.body?.shipments;

    const carrier = await Carrier.findOne({
      _id: carrierId,
      organization_id: user.organization,
    });
    if (!carrier) {
      return res.status(401).json({
        error:
          "Não foi possível encontrar a transportadora especificada. Verifique se o nome está correto ou se a transportadora está cadastrada no sistema.",
      });
    }

    const accounts = await Account.find({
      organization_id: {
        $in: [user.organization],
      },
    });

    const appointments = await Appointment.find();
    async function removeShipmentFromAppointments(appointments, shipmentId) {
      for (const appointment of appointments) {
        if (appointment.shipments.includes(shipmentId)) {
          // Remove o shipment ID do appointment
          appointment.shipments = appointment.shipments.filter(
            (id) => id !== shipmentId
          );

          // Se a lista de shipments estiver vazia, deleta o appointment
          if (appointment.shipments.length === 0) {
            await Appointment.findByIdAndDelete(appointment._id);
          } else {
            // Caso contrário, atualiza o appointment
            await appointment.save();
          }
        }
      }
    }

    const createdShipments = [];
    for (let i = 0; i < shipments.length; i++) {
      let shipmentId = shipments[i];
      const shippingExists = await Package.findOne({
        _id: String(shipmentId),
        organization_id: user.organization,
      });

      if (!shippingExists) continue;

      const receiver = shippingExists.receiver_address;
      const rules = carrier.shipment_prices.map((rule) => rule._doc);
      const freightPrice = checkFreightPrice(rules, {
        state: receiver?.state?.name,
        city: receiver?.city?.name,
      });

      const account = accounts.find(
        (a) => a.seller_id === shippingExists.sender_id
      );
      createdShipments.push({
        id: shippingExists.id,
        carrier: carrier.name,
        deliveryman,
        organization_id: user.organization,
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
      });

      // Remove shipment from appointments if it has been sent
      await removeShipmentFromAppointments(appointments, shippingExists.id);
    }

    await Shipment.insertMany(createdShipments);

    // sendEmail(
    //   createdShipments.map((s) => ({
    //     ...s,
    //     created: format(new Date(), "dd/MM/yyyy HH:mm"),
    //   })),
    //   user.email
    // );

    return res.sendStatus(201);
  }

  static async getAll(req, res) {
    const user = req.user;

    const { shipment_id, daterange_from, daterange_to, carrier, deliveryman } =
      req.query;

    const query = {
      organization_id: { $in: [user.organization] },
    };

    // Add filters based on the presence of query parameters
    if (shipment_id) {
      query.id = shipment_id;
    }

    if (daterange_from && daterange_to) {
      // Converte as strings para objetos Date
      const startDate = new Date(daterange_from);
      const endDate = new Date(daterange_to);
      // Ajusta o final do dia para 23:59:59.999
      const endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      // Define o filtro de data
      query.created = {
        $gte: startDate, // Data inicial (início do dia)
        $lte: endOfDay, // Data final (final do dia)
      };
    } else if (daterange_from) {
      // Apenas data inicial
      query.created = { $gte: new Date(daterange_from) };
    } else if (daterange_to) {
      // Apenas data final
      const endOfDay = new Date(daterange_to);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query.created = { $lte: endOfDay };
    }

    if (carrier) {
      query.carrier = carrier;
    }

    if (deliveryman) {
      query.deliveryman = deliveryman;
    }

    const shipments = await Shipment.find(query);
    const packageIds = shipments.map(s => s.id);
    const packages = await Package.find({ _id: { $in: packageIds } });

    const packageMap = new Map(packages.map(p => [p._id.toString(), { status: p.status, substatus: p.substatus }]));

    const mergedShipments = shipments.map(s => ({
      ...s.toObject(),
      status: packageMap.get(s.id.toString())?.status || null,
      sub_status: packageMap.get(s.id.toString())?.substatus || null,
    }));


    return res.json({ shipments: mergedShipments });
  }
}

export default ShippingController;
