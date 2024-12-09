const express = require("express");
const router = express.Router();
const {
  createVariantProduct,
  getVariantProducts,
  getVariantProductById,
  updateVariantProduct,
  deleteVariantProduct,
} = require("../controllers/variantProductController");

router.post("/", createVariantProduct);
router.get("/", getVariantProducts);
router.get("/:id", getVariantProductById);
router.put("/:id", updateVariantProduct);
router.delete("/:id", deleteVariantProduct);

module.exports = router;
