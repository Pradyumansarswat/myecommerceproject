const WishList = require("../models/WishListSchema");
const Product = require("../models/ProductSchema");
const jwt = require("jsonwebtoken");

const addToWishList = async (req, res) => {
  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ message: "Product ID and User ID are required." });
  }

  try {
    let wishList = await WishList.findOne({ userId: userId });

    if (wishList) {
      const productIndex = wishList.products.findIndex(
        (p) => p.toString() === productId
      );
      if (productIndex === -1) {
        wishList.products.push(productId);
      }
    } else {
      wishList = new WishList({
        userId: userId,
        products: [productId],
      });
    }

    await wishList.save();
    res.status(200).json(wishList);
  } catch (error) {
    res.status(500).json({ message: "Error adding to wishList", error });
  }
};

const removeFromWishList = async (req, res) => {
  const { productId, userId } = req.body;

  if (!productId || !userId) {
    return res.status(400).json({ message: "Product ID and User ID are required." });
  }

  try {
    let wishList = await WishList.findOne({ userId: userId });

    if (!wishList) {
      return res.status(404).json({ message: "WishList not found" });
    }

    const productIndex = wishList.products.findIndex((p) => p.toString() === productId);

    if (productIndex > -1) {
      wishList.products.splice(productIndex, 1);
      await wishList.save();
      return res.status(200).json(wishList);
    } else {
      return res.status(404).json({ message: "Product not found in wishList" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error removing from wishList", error: error.message });
  }
};

const getWishList = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const wishList = await WishList.findOne({ userId: userId }).populate("products");

    if (!wishList) {
      return res.status(200).json({ message: "User does not have a wishList." });
    }

    const populatedWishList = await Promise.all(
      wishList.products.map(async (productId) => {
        const product = await Product.findById(productId);
        return product;
      })
    );

    res.status(200).json({ userId: wishList.userId, products: populatedWishList });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving wishList", error: error.message });
  }
};

module.exports = {
  addToWishList,
  removeFromWishList,
  getWishList,
};
