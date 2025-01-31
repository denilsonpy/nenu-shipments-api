import mongoose from "mongoose";
import moment from "moment";
import config from "./config.js";
import Shipment from "./src/models/shipment.model.js";
import Package from "./src/models/package.model.js";
import Account from "./src/models/account.model.js";

mongoose.connect(config.mongoUri || "");
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Mongo database connected!");
});

const today = moment().startOf("day").toISOString();
const tomorrow = moment().add(1, "day").startOf("day").toISOString();

// Consulta para filtrar envios "Flex" da data de hoje
const packages = await Package.find({
  mode: "me2",
  logistic_type: "self_service", // Filtra envios do tipo Flex
  "status_history.date_shipped": { $gte: today, $lt: tomorrow }, // Filtra pela data de hoje
});

const accounts = await Account.find();
const packageIds = packages.map((p) => ({
  id: p.id,
  name: p.receiver_address.receiver_name,
  status: p.status,
  //   state: p.receiver_address.state?.name,
  //   city: p.receiver_address.city?.name,
  //   district: p.receiver_address.neighborhood?.name,
  //   street: p.receiver_address.street_name,
  //   address: p.receiver_address.address_line,
  //   complement: p.receiver_address.comment,
  //   number: p.receiver_address.street_number,
  //   cep: p.receiver_address.zip_code,
  store: accounts.find((a) => a.seller_id === p.sender_id).name,
  url: `https://www.mercadolivre.com.br/vendas/${p?.order_id}/detalhe`,
  shipped: p.status_history.date_shipped
    ? moment(p.status_history.date_shipped).format("DD/MM/YYYY")
    : "",
  delivered: p.status_history.date_delivered
    ? moment(p.status_history.date_delivered).format("DD/MM/YYYY")
    : "",
}));

// Consulta para filtrar envios "Flex" da data de hoje
const shipments = await Shipment.find({
  created: { $gte: today, $lt: tomorrow },
});

const shipmentsIds = shipments.map((s) => s.id);

let notIn = [];
for (let packageId of packageIds) {
  if (!shipmentsIds.includes(packageId.id)) {
    notIn.push(packageId);
  }
}

function convertToCSV(objArray) {
  const array = Array.isArray(objArray) ? objArray : [objArray];
  const header = Object.keys(array[0]);
  const csv = array.map((row) =>
    header
      .map((fieldName) =>
        JSON.stringify(row[fieldName], (key, value) =>
          value === null ? "" : value
        )
      )
      .join(",")
  );
  csv.unshift(header.join(",")); // Adiciona o cabeçalho ao início
  return csv.join("\r\n");
}

// Convertendo os dados para CSV
const csvData = convertToCSV(packageIds);

// Exibindo o CSV gerado no console (ou você pode salvar em um arquivo)
console.log(csvData);

process.exit();
