const express = require('express')
const router = express.Router()
const { authenticateToken } = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  initiateSignup,
  completeSignup,
  loginAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  updateProfilePic,
} = require("../controllers/adminController")

router.post("/signup", initiateSignup)
router.post("/signup-verify", completeSignup)
router.post("/login", loginAdmin)
router.get("/", getAdmins)
router.put("/:id", updateAdmin)
router.delete("/:id", deleteAdmin)
router.get("/:id", getAdminById)
router.post("/forgot-password", forgotPassword)
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP)
router.post("/reset-password", resetPassword)
router.post("/update-profile-pic", authenticateToken, upload.single('profilePic'), updateProfilePic)

module.exports = router
