import Account from "../models/account.model.js";
import { isExpired } from "../utils/date.js";
import { MercadoLivreAccountAPI } from "../utils/mercadolivre/MercadoLivreAccount.js";

export async function refreshAccountToken(req, res, next) {
  // Authentication logic
  // Retrieve accounts from database
  const accounts = await Account.find({
    email: {
      $in: ["alessandro@nenu.com.br"],
    },
  });
  // Refresh account tokens
  for (let account of accounts) {
    const isTokenExpired = isExpired(account.updated, account.expires_in);
    if (isTokenExpired) {
      const mercadoLivreAccountAPI = new MercadoLivreAccountAPI();
      const newToken = await mercadoLivreAccountAPI.refresh(
        account.refresh_token
      );
      await Account.updateOne(
        {
          _id: account._id,
        },
        {
          access_token: newToken.access_token,
          refresh_token: newToken.refresh_token,
          expires_in: newToken.expires_in,
          updated: new Date(),
        }
      );
    }
  }

  next();
}
