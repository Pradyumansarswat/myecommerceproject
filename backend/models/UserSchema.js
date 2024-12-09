const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.status === "active";
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: function () {
        return this.status === "active";
      },
      unique: true,
      minlength: 10,
      maxlength: 10,
    },
    password: {
      type: String,
      required: function () {
        return this.status === "active";
      },
    },
    profilePic: {
      type: String,
      default: null,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive", "blocked"],
      default: "pending",
    },
    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
