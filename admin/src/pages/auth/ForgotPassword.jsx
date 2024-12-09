import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  verifyForgotPasswordOTP,
  resetPassword,
} from "../../redux/slices/adminSlice";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tempToken, setTempToken] = useState("");

  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector((state) => state.admin);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword({ emailOrPhone })).unwrap();
      toast.success("OTP sent successfully");
      setStep(2);
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(verifyForgotPasswordOTP({ emailOrPhone, otp })).unwrap();
      setTempToken(result.tempToken);
      toast.success("OTP verified successfully");
      setStep(3);
    } catch (error) {
      toast.error(error.message || "Failed to verify OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      await dispatch(resetPassword({ newPassword, tempToken })).unwrap();
      toast.success("Password reset successful");
      navigate("/admin/login"); 
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center p-4 bg-white items-center h-screen">
      <Toaster />
      <div className="bg-gray-100 p-2 w-full md:w-1/2 xl:w-1/4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold py-3 text-center">Forgot Password</h2>
        {isError && <p className="text-red-500 text-center">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="mb-4">
              <label htmlFor="emailOrPhone" className="block text-gray-700 text-sm font-bold mb-2">
                Email or Phone
              </label>
              <input
                type="text"
                id="emailOrPhone"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter email or phone"
                required
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Send OTP
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter OTP"
                required
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Verify OTP
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="New Password"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirm New Password"
                required
              />
            </div>
            <div className="flex justify-center">
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
