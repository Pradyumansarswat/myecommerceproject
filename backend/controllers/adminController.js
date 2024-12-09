const Admin = require("../models/AdminSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mongoose = require("mongoose");
const upload = require("../middleware/upload");

const tempOTPStorage = new Map();
const generateOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    tempOTPStorage.set(email, {
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log(`OTP for ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const initiateSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingAdmin = await Admin.findOne({ $or: [{ email }, { phone }] });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const admin = new Admin({
      name,
      email,
      phone,
      password,
      status: 'pending',
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    await admin.save();

    console.log(`Signup OTP for ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error initiating signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const completeSignup = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    const admin = await Admin.findOne({ 'otp.code': otp, status: 'pending' });
    if (!admin) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (admin.otp.expiresAt < new Date()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(admin.password, 10);

    admin.password = hashedPassword;
    admin.status = 'active';
    admin.otp = undefined;

    await admin.save();

    // Ensure userId is included in the token
    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        status: admin.status
      },
      token
    });
  } catch (error) {
    console.error("Error completing signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: "Email/Phone and password are required" });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const admin = await Admin.findOne(query);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...adminWithoutPassword } = admin.toObject();
    res.status(200).json({
      message: "Login successful",
      admin: adminWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Error logging in Admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, "-password");
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error getting admins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const options = { new: true, runValidators: true };

    const admin = await Admin.findByIdAndUpdate(id, updates, options);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid admin ID format" });
    }

    const admin = await Admin.findById(id).select('-password'); // Exclude password from the response
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    console.error("Error fetching admin by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    if (!emailOrPhone) {
      return res.status(400).json({ error: "Email or phone is required" });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const admin = await Admin.findOne(query);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    admin.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };

    await admin.save();

    console.log(`Password reset OTP for ${emailOrPhone}: ${otp}`);

    res.status(200).json({ message: "Password reset OTP sent successfully" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { emailOrPhone, otp } = req.body;

    if (!emailOrPhone || !otp) {
      return res.status(400).json({ error: "Email/Phone and OTP are required" });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const admin = await Admin.findOne({ ...query, 'otp.code': otp });

    if (!admin || admin.otp.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const tempToken = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      tempToken: tempToken
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword, tempToken } = req.body;

    if (!newPassword || !tempToken) {
      return res.status(400).json({ error: "New password and temporary token are required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(tempToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const admin = await Admin.findById(decoded.adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.otp = undefined;
    await admin.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    console.log('Received request to update profile pic');
    console.log('Request user:', req.user);
    console.log('Request file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const adminId = req.user.userId;

    if (!adminId) {
      console.log('No adminId found in request');
      return res.status(401).json({ error: "Unauthorized" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      console.log('Admin not found for id:', adminId);
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.profilePic = `uploads/${req.file.filename}`;
    await admin.save();

    console.log('Profile picture updated successfully');
    res.status(200).json({ message: "Profile picture updated successfully", profilePic: admin.profilePic });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  generateOTP,
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
};
