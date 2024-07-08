import axios from "axios";
import config from "../../../config.js";

export class MercadoLivreAccountAPI {
  async authenticate(code) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.meliAPiUrl}/oauth/token`, {
          grant_type: "authorization_code",
          client_id: config.meliClientId,
          client_secret: config.meliClientSecret,
          code,
          redirect_uri: config.meliRedirectUri,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error in authenticate:", error);
          reject("Failed to authenticate with Mercado Livre API");
        });
    });
  }

  async refresh(refreshToken) {
    return new Promise((resolve, reject) => {
      axios
        .post(`${config.meliAPiUrl}/oauth/token`, {
          grant_type: "refresh_token",
          client_id: config.meliClientId,
          client_secret: config.meliClientSecret,
          refresh_token: refreshToken,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error in refresh:", error);
          reject("Failed to refresh token with Mercado Livre API");
        });
    });
  }

  async me(token) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${config.meliAPiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((response) => {
          console.error("Error in me:", error);
          reject("Failed to get user data in Mercado Livre API");
        });
    });
  }
}
