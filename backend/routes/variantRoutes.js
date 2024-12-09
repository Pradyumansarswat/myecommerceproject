const express = require("express");
const router = express.Router();
const {
  createVariant,
  getVariantsByProductId,
  updateVariant,
  deleteVariant,
} = require("../controllers/variantController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, createVariant); 
router.get("/product/:productId", getVariantsByProductId); 
router.put("/:id", authenticateToken, updateVariant); 
router.delete("/:id", authenticateToken, deleteVariant); 

module.exports = router;
