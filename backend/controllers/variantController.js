const Variant = require("../models/variantSchema");
const Product = require("../models/ProductSchema");

const createVariant = async (req, res) => {
  try {
    const { productId, color, size, price, sellPrice, stock, description, variantImage } = req.body;

    const variant = new Variant({
      productId,
      sellerId: req.user.sellerId, 
      color,
      size,
      price,
      sellPrice,
      stock,
      description,
      variantImage,
    });

    await variant.save();

    await Product.findByIdAndUpdate(productId, { $push: { variants: variant._id } });

    res.status(201).json({
      message: "Variant created successfully",
      variant,
    });
  } catch (error) {
    console.error("Error creating variant:", error);
    res.status(500).json({
      message: "Failed to create variant",
      error: error.message,
    });
  }
};

const getVariantsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const variants = await Variant.find({ productId });

    res.status(200).json({
      message: "Variants fetched successfully",
      variants,
    });
  } catch (error) {
    console.error("Error fetching variants:", error);
    res.status(500).json({
      message: "Failed to fetch variants",
      error: error.message,
    });
  }
};

const updateVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const variant = await Variant.findByIdAndUpdate(id, updates, { new: true });

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    res.status(200).json({
      message: "Variant updated successfully",
      variant,
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    res.status(500).json({
      message: "Failed to update variant",
      error: error.message,
    });
  }
};

const deleteVariant = async (req, res) => {
  try {
    const { id } = req.params;

    const variant = await Variant.findByIdAndDelete(id);

    if (!variant) {
      return res.status(404).json({ message: "Variant not found" });
    }

    await Product.findByIdAndUpdate(variant.productId, { $pull: { variants: id } });

    res.status(200).json({
      message: "Variant deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({
      message: "Failed to delete variant",
      error: error.message,
    });
  }
};

module.exports = {
  createVariant,
  getVariantsByProductId,
  updateVariant,
  deleteVariant,
};

