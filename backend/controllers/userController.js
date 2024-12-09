const User = require("../models/UserSchema");
const Address = require("../models/AddressSchema"); // Import the Address model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mongoose = require("mongoose");

const tempUserStorage = new Map();

const initiateSignup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const tempUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      otp: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000)
      },
      status: 'pending'
    };

    const tempUserId = email;
    tempUserStorage.set(tempUserId, tempUser);

    console.log(`Signup OTP for ${email}: ${otp}`);

    res.status(200).json({ message: "OTP sent successfully", tempUserId, otp });
  } catch (error) {
    console.error("Error initiating signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const completeSignup = async (req, res) => {
  try {
    const { tempUserId, otp } = req.body;

    const tempUser = tempUserStorage.get(tempUserId);
    if (!tempUser) {
      return res.status(404).json({ error: "Signup session not found or expired" });
    }

    if (otp !== tempUser.otp.code || new Date() > tempUser.otp.expiresAt) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    const newUser = new User({
      name: tempUser.name,
      email: tempUser.email,
      phone: tempUser.phone,
      password: tempUser.password,
      status: 'active'
    });

    await newUser.save();

    tempUserStorage.delete(tempUserId);

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "20d",
    });

    res.status(201).json({
      message: "User account created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        status: newUser.status
      },
      token
    });
  } catch (error) {
    console.error("Error completing signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: "Email/Phone and password are required" });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { phone: emailOrPhone };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, status: user.status },
      process.env.JWT_SECRET,
      { expiresIn: "100d" } 
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 50 * 24 * 60 * 60 * 1000 
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    let query = {};

    if (status && ["active", "inactive"].includes(status)) {
      query.status = status;
    }

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      sort: { createdAt: -1 },
      select: "-password",
    };

    const [users, total] = await Promise.all([
      User.find(query, null, options),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      users,
      totalPages,
      currentPage: parseInt(page),
      totalUsers: total,
    });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const options = { new: true, runValidators: true };

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (updates.address) {
      updates.address = updates.address; 
    }

    const user = await User.findByIdAndUpdate(id, updates, options).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -otp");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
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

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true,
    });

    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    };

    await user.save();

    console.log(`Password reset OTP for ${emailOrPhone}: ${otp}`);

    res.status(200).json({ message: "Password reset OTP sent successfully", otp });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ error: "OTP is required" });
    }

    const user = await User.findOne({ 'otp.code': otp });

    if (!user || user.otp.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const tempToken = jwt.sign(
      { userId: user._id },
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

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.user.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.profilePic =req.file.path.replace(/\\/g, '/').replace(/^.*[\\/]/, '');
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully", profilePic: user.profilePic });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addOrUpdateAddress = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  try {

    const { addressId, houseNumber, street, city, state, zipCode, country , status} = req.body;

    if (!houseNumber || !street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ error: "All address fields are required" });
    }

    let address;
    if (addressId) {
      address = await Address.findByIdAndUpdate(
        addressId,
        {
          houseNumber,
          street,
          city,
          state,
          zipCode,
          country,
          status
        },
        { new: true, runValidators: true }
      );
    } else {
      address = new Address({
        userId,
        houseNumber,
        street,
        city,
        state,
        zipCode,
        country,
        status
      });
      await address.save();
    }

    if (!addressId) {
      await User.findByIdAndUpdate(userId, { $addToSet: { addresses: address._id } });
    }

    res.status(201).json({ message: "Address added/updated successfully", address });
  } catch (error) {
    console.error("Error adding/updating address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeAddress = async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  try {
    const { addressId } = req.params;

    const address = await Address.findByIdAndUpdate(addressId, { deleted: true }, { new: true });
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    await User.findByIdAndUpdate(userId, { $pull: { addresses: addressId } });

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAddresses = async (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  try {
    const addresses = await Address.find({ userId: userId, deleted: false });
    if (!addresses.length) {
      return res.status(404).json({ message: "No addresses found for this user" });
    }

    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getDeletedAddresses = async (req, res) => {
  const userId = req.params.userId;
  try {
    const addresses = await Address.find({ userId: userId, deleted: true });
    if (!addresses.length) {
      return res.status(404).json({ message: "No deleted addresses found for this user" });
    }
    res.status(200).json(addresses);
  } catch (error) {
    console.error("Error retrieving deleted addresses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  initiateSignup,
  completeSignup,
  loginUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
  updateProfilePic,
  addOrUpdateAddress, 
  removeAddress, 
  getAddresses, 
  getDeletedAddresses,
};

