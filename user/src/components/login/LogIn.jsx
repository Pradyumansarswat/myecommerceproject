import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "./LogIn.css";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [step, setStep] = useState("login");
  const [otpToken, setOtpToken] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { emailOrPhone, password }
      );
      // console.log(response.data.token)

      Cookies.set("token", response.data.token);
      navigate("/");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { emailOrPhone }
      );
      setReceivedOtp(response.data.otp);
      setStep("otp");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/verify-forgot-password-otp",
        { otp }
      );
      console.log(response.data);
      setOtpToken(response.data.tempToken);
      setStep("resetPassword");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/reset-password",
        { tempToken: otpToken, newPassword }
      );

      navigate("/login");
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const handleErrorResponse = (error) => {
    if (error.response) {
      setErrorMessage(
        error.response.data.message || "An error occurred. Please try again."
      );
    } else if (error.request) {
      setErrorMessage(
        "No response from the server. Please check your network connection."
      );
    } else {
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <img
        src="https://images.pexels.com/photos/953864/pexels-photo-953864.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="Shopping Cart and Phone"
        className="login-image"
      />

      <div className="login-form-section">
        <div className="login-form">
          {step === "login" && (
            <>
              <h2>Log in to Exclusive</h2>
              <p>Enter your details below</p>
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  className="input-field"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <div className="action-buttons">
                  <button type="submit" className="login-btn">
                    Log In
                  </button>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => setStep("forgotPassword")}
                  >
                    Forgot Password?
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "forgotPassword" && (
            <>
              <h2>Forgot Password</h2>
              <p>Enter your email or phone number to receive an OTP</p>
              <form onSubmit={handleForgotPassword}>
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  className="input-field"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                />
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <button type="submit" className="login-btn">
                  Send OTP
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <h2>Verify OTP</h2>
              <form onSubmit={handleVerifyOtp}>
                <p className="info-text">
                  The OTP sent to your email/phone is:{" "}
                  <strong>{receivedOtp}</strong>
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="input-field"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <button type="submit" className="login-btn">
                  Verify OTP
                </button>
              </form>
            </>
          )}

          {step === "resetPassword" && (
            <>
              <h2>Reset Password</h2>
              <form onSubmit={handleResetPassword}>
                <input
                  type="password"
                  placeholder="New Password"
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {errorMessage && <p className="error-text">{errorMessage}</p>}
                <button type="submit" className="login-btn">
                  Change Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogIn;
