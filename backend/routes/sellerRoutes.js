const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/initiate-signup", upload.single('adharCardPic'), sellerController.initiateSignup);
router.post("/complete-signup", sellerController.completeSignup);
router.post("/login", sellerController.loginSeller);
router.get("/", sellerController.getSellers);
router.get("/:id", sellerController.getSellerById);
router.put("/:id", sellerController.updateSeller);
router.delete("/:id", sellerController.deleteSeller);
router.post("/forgot-password", sellerController.forgotPassword);
router.post("/verify-forgot-password-otp", sellerController.verifyForgotPasswordOTP);
router.post("/reset-password", sellerController.resetPassword);
router.post("/update-profile-pic", authenticateToken, upload.single('profilePic'), sellerController.updateProfilePic);

module.exports = router;
