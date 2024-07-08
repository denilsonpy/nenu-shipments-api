import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  email: String,
  seller_id: Number,
  name: String,
  access_token: String,
  refresh_token: String,
  expires_in: Number,
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
