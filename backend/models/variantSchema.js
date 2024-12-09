const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    sellPrice: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    variantImage: [
      {
        type: String,
        required: true,
      },
    ],
    description: { 
      type: String,
      required: true, 
    },
  },
  { timestamps: true }
);

const Variant = mongoose.model("Variant", variantSchema);

module.exports = Variant;
