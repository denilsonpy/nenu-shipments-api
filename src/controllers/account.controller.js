import { randomUUID } from "node:crypto";
import Account from "../models/account.model.js";
import { MercadoLivreAccountAPI } from "../utils/mercadolivre/MercadoLivreAccount.js";

class AccountController {
  static async getAllAccounts(req, res) {
    const email = req.user;
    // Retrieve all accounts linked to the user
    const accounts = await Account.find(
      { email },
      {
        email: 0,
        access_token: 0,
        refresh_token: 0,
        expires_in: 0,
        __v: 0,
      }
    );
    return res.json({ accounts });
  }

  // Link a Mercado Livre account to the user
  static async vinculate(req, res) {
    // Retrieve request data
    const email = req.user;
    const { code } = req.body;
    // Validate that the code is defined and is a string
    if (!code || typeof code !== "string") {
      return res
        .status(400)
        .json({ error: "The code must be defined and should be a string!" });
    }
    // Retrieve account authentication details
    try {
      const mercadoLivreAccountAPI = new MercadoLivreAccountAPI();
      const authDetails = await mercadoLivreAccountAPI.authenticate(code);
      // Retrieve account details
      const accountDetails = await mercadoLivreAccountAPI.me(
        authDetails.access_token
      );
      const companyName = accountDetails.company.brand_name || randomUUID();
      // Check if account already exists
      const accountExists = await Account.findOne({
        seller_id: accountDetails.id,
      });
      if (accountExists) {
        await Account.updateOne(
          {
            email,
            seller_id: accountDetails.id,
          },
          {
            email,
            seller_id: accountDetails.id,
            name: companyName,
            access_token: authDetails.access_token,
            refresh_token: authDetails.refresh_token,
            expires_in: authDetails.expires_in,
            updated: Date.now(),
          }
        );
        return res.sendStatus(201);
      }
      // Create account object
      const newAccount = new Account({
        email,
        seller_id: accountDetails.id,
        name: companyName,
        access_token: authDetails.access_token,
        refresh_token: authDetails.refresh_token,
        expires_in: authDetails.expires_in,
      });
      await newAccount.save();
      return res.sendStatus(201);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async removeAccount(req, res) {}
}

export default AccountController;
