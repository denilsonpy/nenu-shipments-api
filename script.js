import mongoose from "mongoose";
import Organization from "./src/models/organization.model.js";
import User from "./src/models/user.model.js";
import config from "./config.js";
import Shipment from "./src/models/shipment.model.js";
import Package from "./src/models/package.model.js";
import Label from "./src/models/label.model.js";
import Carrier from "./src/models/carrier.model.js";
import Account from "./src/models/account.model.js";
import Appointment from "./src/models/appointment.model.js";

// Connection with database
mongoose.connect(config.mongoUri || "");
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Mongo database connected!");
});

// // Função para criar uma organização
// async function createOrganization(name, description) {
//   const organization = new Organization({ name, description });
//   await organization.save();
//   return organization;
// }

// // Função para associar um usuário a uma organização
// async function addUserToOrganization(userId, organizationId) {
//   const user = await User.findById(userId);
//   const organization = await Organization.findById(organizationId);

//   if (!user || !organization) {
//     throw new Error("Usuário ou organização não encontrado");
//   }

//   // Adiciona o usuário à organização
//   organization.users.push(user._id);
//   await organization.save();

//   // Adiciona a organização ao usuário
//   user.organizations.push(organization._id);
//   await user.save();
// }

// Exemplo de uso
(async () => {
  try {
    const organizationId = new mongoose.Types.ObjectId(
      "679c35863b6804f627d8768a"
    );
    await Shipment.updateMany(
      { from_user_id: "alessandro@nenu.com.br" }, // Filtro vazio para aplicar a todos os documentos
      {
        $set: {
          organization_id: organizationId,
        },
      } // Adiciona organization_id como ObjectId
    );
    await Label.updateMany(
      {}, // Filtro vazio para aplicar a todos os documentos
      {
        $set: {
          organization_id: organizationId,
        },
      } // Adiciona organization_id como ObjectId
    );
    await Package.updateMany(
      { user_email: "alessandro@nenu.com.br" }, // Filtro vazio para aplicar a todos os documentos
      {
        $set: {
          organization_id: organizationId,
        },
      } // Adiciona organization_id como ObjectId
    );
    // // Cria um usuário
    // const user = await User.findOne({ email: "alessandro@nenu.com.br" });
    // console.log(user);

    // // Cria uma organização
    // const organization = await Organization.findById(
    //   "679c35863b6804f627d8768a"
    // );
    // console.log("Organização criada:", organization);

    // Associa o usuário à organização
    // await addUserToOrganization(user._id, organization._id);
    console.log("Sucesso!");
  } catch (error) {
    console.error("Erro:", error);
  }
})();
