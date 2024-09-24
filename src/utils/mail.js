import nodemailer from "nodemailer";
import { format } from "date-fns";
import { createObjectCsvWriter } from "csv-writer";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Function to create CSV file
const createCsvFile = async (shipments, path) => {
  const csvWriter = createObjectCsvWriter({
    path: path,
    header: [
      { id: "id", title: "ID" },
      { id: "carrier", title: "Transportadora" },
      { id: "deliveryman", title: "Entregador" },
      { id: "name", title: "Nome" },
      { id: "state", title: "Estado" },
      { id: "city", title: "Cidade" },
      { id: "district", title: "Bairro" },
      { id: "street", title: "Rua" },
      { id: "number", title: "Número" },
      { id: "complement", title: "Complemento" },
      { id: "cep", title: "CEP" },
      { id: "store", title: "Loja" },
      { id: "url", title: "URL" },
      { id: "tag", title: "Etiqueta" },
      { id: "freight_price", title: "Valor do Frete" },
      { id: "created", title: "Data" },
    ],
  });

  await csvWriter.writeRecords(
    shipments.map((shipment) => ({
      ...shipment,
      tag: `https://manager.tracken.app.br/sistema2/public/index.php/imprimir/${shipment.id}`,
    }))
  );
  console.log("CSV file created successfully");
};

// Function to send email with CSV attachment
export const sendEmail = async (shipments, mail) => {
  // Create the CSV file
  const csvFilePath = path.join("./", `${randomUUID()}.csv`);
  await createCsvFile(shipments, csvFilePath);

  // Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ecommercepense@gmail.com",
      pass: "qdei sbak rhjo moof", // Use environment variables for sensitive information
    },
  });

  // Define the email content
  const subject = `NOVOS ENVIOS CADASTRADOS - ${format(
    new Date(),
    "dd-MM-yyyy"
  )}`;
  let body = "Segue em anexo envios cadastrados";

  // Define the recipients
  const recipients = [mail];

  // Send the email
  try {
    await transporter.sendMail({
      from: '"Shipments API" <ecommercepense@gmail.com>', // sender address
      to: recipients.join(", "), // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
      attachments: [
        {
          filename: `${shipments[0].carrier
            .toLowerCase()
            .replace(/ /g, "_")}_${shipments[0].deliveryman
              .toLowerCase()
              .replace(/ /g, "_")}_${format(
                new Date(),
                "dd_MM_yyyy_HH'h'mm"
              )}.csv`,
          path: csvFilePath,
        },
      ],
    });
    console.log("Email enviado com sucesso");
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  } finally {
    // Clean up the CSV file after sending the email
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        console.error("Erro ao deletar o arquivo CSV:", err);
      } else {
        console.log("Arquivo CSV deletado com sucesso");
      }
    });
  }
};


export const sendMail = async (subject, body, mail) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ecommercepense@gmail.com",
      pass: "qdei sbak rhjo moof",
    },
  });

  // Define the recipients
  const recipients = [mail, "alessandro@nenu.com.br"];

  // Send the email
  try {
    await transporter.sendMail({
      from: '"Shipments API" <ecommercepense@gmail.com>', // sender address
      to: recipients.join(", "), // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body

    });
    console.log("Email enviado com sucesso");
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
  }
};