const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    categories: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    status: {
      type: String,
      enum: ["active", "pending", "rejected"],
      default: "pending",
    },
    rejectedReason: {
      type: String,
    },
    variants: [
      {
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
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
        description: {
          type: String,
        },
        image: [{
          type: String, 
        }],
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

async function dropCategoriesIndex() {
  try {
    await Product.collection.dropIndex('categories_1');
    console.log('Categories index dropped successfully');
  } catch (error) {
    if (error.code === 27) {
      console.log('Categories index does not exist, no need to drop');
    } else {
      console.error('Error dropping categories index:', error);
    }
  }
}
  
dropCategoriesIndex();

module.exports = Product;
