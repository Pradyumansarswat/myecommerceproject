const Cart = require("../models/CartSchema");
const User = require("../models/UserSchema");
const Product = require("../models/ProductSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const addToCart = async (req, res) => {
  const { productId, userId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required." });
  }

  try {
    let cart = await Cart.findOne({ userId: userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );
      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        userId: userId,
        products: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

const removeFromCart = async (req, res) => {
  const { productId } = req.body;
  const { userId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res
      .status(500)
      .json({ message: "Error removing from cart", error: error.message });
  }
};

const clearCart = async (req, res) => {
  const userId = req.params.userId;
  try {
    const cart = await Cart.findOneAndDelete({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: error.message });
  }
};

const getCart = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const cart = await Cart.findOne({ userId: userId }).populate(
      "products.product"
    );

    if (!cart) {
      console.error(`Cart not found for user ID: ${userId}`);
      return res.status(200).json({ message: "User does not have a cart." });
    }

    res.status(200).json(cart);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving cart", error: error.message });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  clearCart,
};
