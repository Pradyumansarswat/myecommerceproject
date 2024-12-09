const express = require("express");
const router = express.Router();
const {
  addToWishList,
  removeFromWishList,
  getWishList,
} = require("../controllers/wishListController");
const { authenticateToken } = require("../middleware/auth");

router.post("/add", addToWishList);
router.post("/remove", removeFromWishList);
router.get("/:userId", getWishList);

module.exports = router;
