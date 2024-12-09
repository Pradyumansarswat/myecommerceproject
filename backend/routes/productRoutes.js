const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsBySellerId,
  getProductsByCategory,
  getProductsByStatus,
  getSellerProductsByCategory,
  updateProductImages,
  updateVariantImages,
  getProductsBySellerIdAndStatus,
  updateProductStatus,
  deleteProductImage,
  updateProductStock,
} = require("../controllers/productController");
const { authenticateToken } = require("../middleware/auth");
const upload = require('../middleware/upload');

router.post("/", authenticateToken, upload.fields([{ name: 'images', maxCount: 10 }, { name: 'variantImage', maxCount: 10 }]), createProduct);
router.get("/", getProducts);
router.get("/status/:status", getProductsByStatus);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.put("/status/:id", updateProductStatus);
router.delete("/:id", authenticateToken, deleteProduct);
router.get("/seller/:sellerId", getProductsBySellerId);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/seller/:sellerId/category/:categoryId", getSellerProductsByCategory);
router.put("/:id/images", authenticateToken, updateProductImages);
router.put("/:id/variantImages", authenticateToken, upload.fields([{ name: 'variantImage', maxCount: 10 }]), updateVariantImages);
router.get("/seller/:sellerId/status", getProductsBySellerIdAndStatus);
router.delete('/products/:id/images/:imageName', deleteProductImage);
router.put("/:id/stock", updateProductStock); // Route for updating product stock

module.exports = router;
  