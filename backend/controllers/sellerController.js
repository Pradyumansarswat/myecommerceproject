const Seller = require("../models/SellerSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const upload = require("../middleware/upload");

const initiateSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const adharCardPic = req.file.path.replace(/\\/g, '/').replace(/^.*[\\/]/, '');

    if (!name || !email || !phone || !password || !adharCardPic) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingSeller = await Seller.findOne({ $or: [{ email }, { phone }] });
    if (existingSeller) {
      return res.status(400).json({ error: "Seller already exists" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = new Seller({
      name,
      email,
      phone,
      password: hashedPassword,
      adharCardPic,
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) 
      },
      status: 'pending'
    });

    await newSeller.save();

    console.log(`Signup OTP for ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully", sellerId: newSeller._id });
  } catch (error) {
    console.error("Error initiating signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const completeSignup = async (req, res) => {
  try {
    const { sellerId, otp } = req.body;

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    if (!seller.otp || otp !== seller.otp.code || new Date() > seller.otp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    seller.status = 'pending';
    seller.otp = undefined;
    await seller.save();

    const token = jwt.sign({ sellerId: seller._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Seller account created successfully",
      seller: {
        _id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        status: seller.status
      },
      token
    });
  } catch (error) {
    console.error("Error completing signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginSeller = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: "Email/Phone and password are required" });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const seller = await Seller.findOne(query);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sellerId: seller._id, status: seller.status },
      process.env.JWT_SECRET,
      { expiresIn: "50d" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
      maxAge: 50 * 24 * 60 * 60 * 1000 // 50 days
    });

    const { password: _, ...sellerWithoutPassword } = seller.toObject();
    res.status(200).json({
      message: "Login successful",
      seller: sellerWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Error logging in seller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSellers = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status && ["active", "inactive", "pending"].includes(status)) {
      query.status = status;
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
      select: "-password -otp",
    };

    const [sellers, total] = await Promise.all([
      Seller.find(query, null, options),
      Seller.countDocuments(query),
    ]);

    res.status(200).json({
      sellers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error getting sellers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const options = { new: true, runValidators: true };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const seller = await Seller.findByIdAndUpdate(id, updates, options).select("-password");
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.status(200).json(seller);
  } catch (error) {
    console.error("Error updating seller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findByIdAndDelete(id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (error) {
    console.error("Error deleting seller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select("-password -otp");
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
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

    const seller = await Seller.findOne(query);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    seller.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };

    await seller.save();

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

    const seller = await Seller.findOne({
      ...query,
      'otp.code': otp,
      'otp.expiresAt': { $gt: new Date() }
    });

    if (!seller) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const tempToken = jwt.sign(
      { sellerId: seller._id },
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

    const seller = await Seller.findById(decoded.sellerId);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    seller.password = hashedPassword;
    seller.otp = undefined;
    await seller.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    console.log('Received request to update seller profile pic');
    console.log('Request user:', req.user);
    console.log('Request file:', req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const sellerId = req.user.id || req.user.sellerId; 

    if (!sellerId) {
      console.log('No sellerId found in request');
      return res.status(401).json({ error: "Unauthorized" });
    }

    const seller = await Seller.findById(sellerId);
    if (!seller) {
      console.log('Seller not found for id:', sellerId);
      return res.status(404).json({ error: "Seller not found" });
    }

    seller.profilePic = req.file.path.replace(/\\/g, '/').replace(/^.*[\\/]/, ''); 
    await seller.save();

    console.log('Seller profile picture updated successfully');
    res.status(200).json({ message: "Profile picture updated successfully", profilePic: seller.profilePic });
  } catch (error) {
    console.error("Error updating seller profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  initiateSignup,
  completeSignup,
  loginSeller,
  getSellers,
  updateSeller,
  deleteSeller,
  getSellerById,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  updateProfilePic,
};
