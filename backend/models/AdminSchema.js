const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['pending', 'active'],
    default: 'pending'
  },
  otp: {
    code: { type: String },
    expiresAt: { type: Date }
  },
  profilePic: {
    type: String,
    default: null
  },
}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
