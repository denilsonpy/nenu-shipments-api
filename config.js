import env from "env-var";
import dotenv from "dotenv";
dotenv.config();

const config = {
  port: env.get("PORT").required().asInt(),
  mongoUri: env.get("MONGODB_URI").required().asString(),

  jwtSecretKey: env.get("JWT_SECRET_KEY").required().asString(),
  jwtTokenExpiration: env.get("JWT_TOKEN_EXPIRATION").required().asString(),
  jwtRefreshExpiration: env.get("JWT_REFRESH_EXPIRATION").required().asString(),

  meliClientId: env.get("MELI_CLIENT_ID").required().asString(),
  meliClientSecret: env.get("MELI_CLIENT_SECRET").required().asString(),
  meliRedirectUri: env.get("MELI_REDIRECT_URI").required().asUrlString(),
  meliAPiUrl: "https://api.mercadolibre.com",
};

export default config;
