import jwt from "jsonwebtoken";
import config from "../../config.js";
import User from "../models/user.model.js";

export function authenticated(req, res, next) {
  // Authentication logic
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(403);

  const bearer = bearerHeader.split(" ");
  const token = bearer[1];

  jwt.verify(token, config.jwtSecretKey, async (err, decoded) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    } else {
      try {
        const user = await User.findOne({ email: decoded.data.email });
        req.user = user;
        return next();
      } catch (error) {
        console.log(error);
        return res.sendStatus(403);
      }
    }
  });
}
