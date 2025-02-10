import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import { parseDuration } from "../utils/date.js";
import config from "../../config.js";

const jwtRefreshExpiration = config.jwtRefreshExpiration;
const jwtTokenExpiration = config.jwtTokenExpiration;
const jwtSecretKey = config.jwtSecretKey;

class AuthController {
  // static async register(req, res) {

  // }

  static async authenticate(req, res) {
    // Get email and password
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: "Invalid data." });
    }

    // User exists
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Email or password incorrect." });
    }

    // Check password hash
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Email or password incorrect." });
    }

    // Authenticate
    const token = jwt.sign({ data: user }, jwtSecretKey, {
      expiresIn: jwtTokenExpiration,
    });
    const refreshToken = jwt.sign({ data: user }, jwtSecretKey, {
      expiresIn: jwtRefreshExpiration,
    });

    const session = new Session({
      token: refreshToken,
      email: user.email,
      expires: new Date(Date.now() + parseDuration(jwtRefreshExpiration)),
    });

    await session.save();

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      permission: user.permission,
      created: user.created,
      updated: user.updated,
      token,
      refreshToken,
    });
  }

  static async refresh(req, res) {
    const { refreshToken: requestToken } = req.body;
    if (requestToken == null) {
      return res.status(403).send("Refresh Token is required!");
    }

    try {
      const refreshToken = await Session.findOne({
        token: requestToken,
      });
      if (!refreshToken) {
        res.status(403).send("Invalid refresh token");
        return;
      }
      const decoded = jwt.verify(refreshToken.token, jwtSecretKey);
      const user = await User.findOne({ email: decoded.data.email });

      // Delete previous session
      await Session.deleteOne({
        token: refreshToken.token,
      });

      // Authenticate
      const token = jwt.sign({ data: user }, jwtSecretKey, {
        expiresIn: jwtTokenExpiration,
      });
      const newRefreshToken = jwt.sign({ data: user }, jwtSecretKey, {
        expiresIn: jwtRefreshExpiration,
      });

      const session = new Session({
        token: newRefreshToken,
        email: user.email,
        expires: new Date(Date.now() + parseDuration(jwtRefreshExpiration)),
      });

      await session.save();

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        created: user.created,
        updated: user.updated,
        token,
        refreshToken: newRefreshToken,
      });
    } catch (err) {
      console.log("err", err);
      return res.status(500).send("Internal server error");
    }
  }
}

export default AuthController;
