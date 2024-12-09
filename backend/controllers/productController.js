const cloudinary = require("cloudinary").v2;
const Product = require("../models/ProductSchema");
const Variant = require("../models/variantSchema");
const Categories = require("../models/CategoriesSchema");
const Seller = require("../models/SellerSchema");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find({}, null, options)
        .populate("categories", "name")
        .populate("sellerId", "name email phone")
        .lean(),
      Product.countDocuments(),
    ]);

    const formattedProducts = products.map((product) => ({
      ...product,
      images: product.images.map((image) => image),
      categories: product.categories || [],
      sellerName: product.sellerId ? product.sellerId.name : "N/A",
    }));

    res.status(200).json({
      message: "Products fetched successfully",
      products: formattedProducts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categories", "name")
      .populate("sellerId", "name email phone")
      .lean();

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const formattedProduct = {
      ...product,
      categoryName: product.categories
        ? product.categories.name
        : "Uncategorized",
    };

    res.status(200).json({
      message: "Product fetched successfully",
      product: formattedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const isStockUpdateOnly =
      Object.keys(updates).length === 1 && updates.hasOwnProperty("stock");
    console.log(isStockUpdateOnly);
    if (!isStockUpdateOnly) {
      updates.status = "pending";
    }

    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.map(image => `uploads/${image}`);
    }

    Object.assign(product, updates);
    await product.save();

    console.log("Updated product:", product);

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const { status, rejectedReason } = req.body;

    if (!["pending", "active", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const product = await Product.findById(req.params.id).populate(
      "sellerId",
      "name email phone"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.status = status;
    if (status === "rejected" && rejectedReason) {
      product.rejectedReason = rejectedReason;
    }

    await product.save();

    res.status(200).json({
      message: "Product status updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({
      message: "Failed to update product status",
      error: error.message,
    });
  }
};

const getProductsBySellerId = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { page = 1, limit = 50, status } = req.query;

    let query = { sellerId };

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(query, null, options).populate("categories"),
      Product.countDocuments(query),
    ]);

    const productsWithDetails = await Promise.all(
      products.map(async (product) => {
        const variants = await Variant.find({ productId: product._id });
        const formattedProduct = product.toObject();

        formattedProduct.categoryName = formattedProduct.categories
          ? formattedProduct.categories.name
          : "Uncategorized";

        delete formattedProduct.categories;

        return {
          ...formattedProduct,
          variants: variants,
        };
      })
    );

    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithDetails,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching products by seller ID:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 50, status } = req.query;

    let query = { categories: categoryId };

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(query, null, options)
        .populate("categories") 
        .populate("sellerId", "name"),
      Product.countDocuments(query),
    ]);

    const productsWithDetails = products.map((product) => {
      const formattedProduct = product.toObject();
      formattedProduct.categoryNames = Array.isArray(formattedProduct.categories)
        ? formattedProduct.categories.map((cat) => cat.name) 
        : [];
      formattedProduct.sellerName = formattedProduct.sellerId
        ? formattedProduct.sellerId.name
        : "N/A";
      return formattedProduct;
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithDetails,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getProductsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 1000 } = req.query;

    if (!["pending", "rejected", "active"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find({ status }, null, options)
        .populate("categories") 
        .populate("sellerId", "name"),
      Product.countDocuments({ status }),
    ]);

    const productsWithDetails = products.map((product) => {
      const formattedProduct = product.toObject();
      formattedProduct.categoryNames = Array.isArray(formattedProduct.categories)
        ? formattedProduct.categories.map((cat) => cat.name)
        : [];
      formattedProduct.sellerName = formattedProduct.sellerId
        ? formattedProduct.sellerId.name
        : "N/A";
      return formattedProduct;
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithDetails,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching products by status:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const getSellerProductsByCategory = async (req, res) => {
  try {
    const { sellerId, categoryId } = req.params;
    const { page = 1, limit = 50, status } = req.query;

    let query = { sellerId, categories: categoryId };

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
    };

    const [products, total] = await Promise.all([
      Product.find(query, null, options)
        .populate("categories")
        .populate("sellerId", "name"),
      Product.countDocuments(query),
    ]);

    const productsWithDetails = products.map((product) => {
      const formattedProduct = product.toObject();
      // Ensure categories is an array before mapping
      formattedProduct.categoryNames = Array.isArray(formattedProduct.categories)
        ? formattedProduct.categories.map((cat) => cat.name)
        : []; 
      formattedProduct.sellerName = formattedProduct.sellerId
        ? formattedProduct.sellerId.name
        : "N/A";
      return formattedProduct;
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithDetails,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching seller products by category:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const updateProductImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        message: "At least one image is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const uniqueImages = images.map(image => {
      const originalName = image.originalname; 
      const extension = originalName.split('.').pop(); 
      const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0]; 
      return `uploads/${timestamp}_${id}.${extension}`; 
    });

    await Promise.all(uniqueImages.map((newPath, index) => {
      return fs.promises.rename(images[index].path, newPath); 
    }));

    product.images = uniqueImages; 
    await product.save();

    res.status(200).json({
      message: "Product images updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product images:", error);
    res.status(500).json({
      message: "Failed to update product images",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, sellPrice, stock, categories, variants } =
      req.body;

    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.sellerId;

    const categoryExists = await Categories.findById(categories);
    if (!categoryExists) {
      return res.status(400).json({
        message: "Invalid category ID",
      });
    }

    const images = req.files.images
      ? req.files.images.map((file) => `uploads/${file.filename}`)
      : [];
    const uniqueImages = [...new Set(images)];

    const parsedVariants =
      typeof variants === "string" ? JSON.parse(variants) : variants;

    const newProduct = new Product({
      sellerId,
      name,
      description,
      price,
      sellPrice,
      stock,
      categories,
      images: uniqueImages,
      // variants: parsedVariants.map((variant, index) => ({
      //   ...variant,
      //   image: req.files.variantImage
      //     ? req.files.variantImage.map((file) => `uploads/${file.filename}`)
      //     : [],
      // })),
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

const updateVariantImages = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const variantImages = req.files.variantImage
      ? req.files.variantImage.map((file) => file.path)
      : [];

    product.variants.forEach((variant, index) => {
      if (variantImages[index]) {
        variant.image = variant.image.concat(variantImages);
      }
    });

    await product.save();

    res.status(200).json({
      message: "Variant images updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating variant images:", error);
    res.status(500).json({
      message: "Failed to update variant images",
      error: error.message,
    });
  }
};

const getProductsBySellerIdAndStatus = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const { status } = req.query;

    let query = { sellerId };

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      query.status = status;
    }

    const products = await Product.find(query)
      .populate("categories")
      .populate("sellerId", "name");

    const productsWithDetails = products.map((product) => {
      const formattedProduct = product.toObject();
      formattedProduct.categoryNames = formattedProduct.categories.map(
        (cat) => cat.name
      );
      formattedProduct.sellerName = formattedProduct.sellerId
        ? formattedProduct.sellerId.name
        : "N/A";
      return formattedProduct;
    });

    res.status(200).json({
      message: "Products fetched successfully",
      products: productsWithDetails,
    });
  } catch (error) {
    console.error("Error fetching products by seller ID and status:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const deleteProductImage = async (req, res) => {
  try {
    const { id, imageName } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imageIndex = product.images.indexOf(imageName);
    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found in product" });
    }

    product.images.splice(imageIndex, 1);
    await product.save();

    const filePath = path.join(__dirname, "../uploads", imageName);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return res.status(500).json({ message: "Failed to delete image file" });
      }
      res.status(200).json({ message: "Image deleted successfully" });
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res
      .status(500)
      .json({ message: "Failed to delete image", error: error.message });
  }
};

const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({
        message: "Invalid stock value. It must be a non-negative number.",
      });
    }

    const product = await Product.findById(req.params.id).populate(
      "sellerId",
      "name email phone"
    ); //

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.stock = stock;
    await product.save();

    res.status(200).json({
      message: "Product stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      message: "Failed to update product stock",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductsBySellerId,
  getProductsByCategory,
  getProductsByStatus,
  getSellerProductsByCategory,
  updateProductImages,
  updateVariantImages,
  getProductsBySellerIdAndStatus,
  deleteProductImage,
  updateProductStock,
};
