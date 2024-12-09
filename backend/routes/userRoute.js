const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/initiate-signup", userController.initiateSignup);
router.post("/complete-signup", userController.completeSignup);
router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-forgot-password-otp", userController.verifyForgotPasswordOTP);
router.post("/reset-password", userController.resetPassword);
router.post("/update-profile-pic", authenticateToken, upload.single('profilePic'), userController.updateProfilePic);
router.post("/address", authenticateToken, userController.addOrUpdateAddress);
router.get("/address/:userId", userController.getAddresses);
router.put("/address/:addressId", authenticateToken, userController.addOrUpdateAddress);
router.delete("/address/:addressId", authenticateToken, userController.removeAddress);
router.get("/address/:addressId", authenticateToken, userController.getAddresses);
router.get("/address/deleted/:userId", authenticateToken, userController.getDeletedAddresses);
// router.get("/address", authenticateToken, userController.getAddressesesByUserId);

module.exports = router;
