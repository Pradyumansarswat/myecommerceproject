import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./SignUp.css";
import Cookies from "js-cookie";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpReceived, setOtpReceived] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [tempUserId, setTempUserId] = useState("");

  const validateName = (name) => name.trim() !== "";
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9]{10}$/.test(phone);
  const validatePassword = (password) => password.length >= 6;
  const validateOtp = (otp) => /^[0-9]{4,6}$/.test(otp);

  const handleCreateAccount = async () => {
    let errors = {};

    if (!validateName(name)) {
      errors.name = "Name is required";
    }
    if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!validatePhone(phone)) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!validatePassword(password)) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    } else {
      setFieldErrors({});
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/initiate-signup`,
        {
          name,
          email,
          phone,
          password,
        }
      );

      if (response.status === 200) {
        setOtpReceived(response.data.otp);
        setTempUserId(response.data.tempUserId);
        setIsOtpSent(true);
        toast.success("Your OTP has been sent for verification.");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (!validateOtp(otp)) {
      setFieldErrors((prev) => ({
        ...prev,
        otp: "Please enter a valid 4-6 digit OTP",
      }));
      return;
    }

    if (otp !== otpReceived) {
      setFieldErrors((prev) => ({
        ...prev,
        otp: "OTP does not match. Please try again.",
      }));
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/complete-signup`,
        {
          tempUserId: tempUserId,
          otp,
        }
      );

      const token = response.data.token;
      Cookies.set("token", token, { expires: 2 });

      const userId = response.data.userId;
      navigate("/");
      // console.log("User ID:", userId);
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrorMessage("Failed to verify OTP. Please try again.");
      toast.error("Failed to verify OTP. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <img
        src="https://images.pexels.com/photos/953864/pexels-photo-953864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Shopping Cart"
        className="signup-image"
      />
      <div className="signup-form-section">
        <div className="signup-form">
          <h2>Create an account</h2>
          <p>Enter your details below</p>
          <div>
            <input
              type="text"
              placeholder="Name"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {fieldErrors.name && (
              <p className="error-text">{fieldErrors.name}</p>
            )}

            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {fieldErrors.email && (
              <p className="error-text">{fieldErrors.email}</p>
            )}

            <input
              type="text"
              placeholder="Phone Number"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {fieldErrors.phone && (
              <p className="error-text">{fieldErrors.phone}</p>
            )}

            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="error-text">{fieldErrors.password}</p>
            )}

            {isOtpSent && (
              <div>
                <p>
                  Your OTP is: <strong>{otpReceived}</strong>
                </p>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className="input-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                {fieldErrors.otp && (
                  <p className="error-text">{fieldErrors.otp}</p>
                )}
                <button
                  onClick={handleVerifyOtp}
                  className="create-account-btn"
                >
                  Verify OTP
                </button>
              </div>
            )}

            {!isOtpSent && (
              <button
                onClick={handleCreateAccount}
                className="create-account-btn"
              >
                Create Account
              </button>
            )}
          </div>

          <div className="google-signup">
            <button className="google-btn">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                alt="Google logo"
                className="google-logo"
              />
              Sign up with Google
            </button>
          </div>

          <p className="login-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>

          {errorMessage && <p className="error-text">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
