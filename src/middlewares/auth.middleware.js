import jwt from "jsonwebtoken";
import config from "../../config.js";

export function authenticated(req, res, next) {
  // Authentication logic
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(403);

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    } else {
      req.user = decoded.data.email;
      return next();
    }
  });
}
