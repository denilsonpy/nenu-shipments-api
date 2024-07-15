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
      { id: "address", title: "Endereço" },
      { id: "complement", title: "Complemento" },
      { id: "number", title: "Número" },
      { id: "cep", title: "CEP" },
      { id: "store", title: "Loja" },
      { id: "url", title: "URl" },
      { id: "created", title: "Data" },
    ],
  });

  await csvWriter.writeRecords(shipments);
  console.log("CSV file created successfully");
};

// Function to send email with CSV attachment
export const sendEmail = async (shipments) => {
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
  const recipients = [
    "contato.denilsonsilva@gmail.com",
    "alessandrovpic@uol.com.br",
  ];

  // Send the email
  try {
    await transporter.sendMail({
      from: '"Shipments API" <ecommercepense@gmail.com>', // sender address
      to: recipients.join(", "), // list of receivers
      subject: subject, // Subject line
      text: body, // plain text body
      attachments: [
        {
          filename: "shipments.csv",
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
