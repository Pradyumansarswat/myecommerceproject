const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: null
  },
  adharCardPic: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "inactive"],
    default: "pending",
  },
  otp: {
    code: String,
    expiresAt: Date
  },
}, { timestamps: true });

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
