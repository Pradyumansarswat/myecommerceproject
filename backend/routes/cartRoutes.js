const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { authenticateToken } = require("../middleware/auth");

router.post("/add", cartController.addToCart);
router.post("/remove", cartController.removeFromCart);
router.get("/:userId", cartController.getCart);
router.delete("/:userId", cartController.clearCart);

module.exports = router;
