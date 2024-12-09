import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initiateSignup, completeSignup, clearSignupStatus } from "../../../redux/slices/sellerSlice";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupStatus, error, signupData } = useSelector((state) => state.seller);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    adharCard: null,
  });
  const [otp, setOtp] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearSignupStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (signupStatus === "succeeded") {
      navigate("/seller/dashboard");
    }
  }, [signupStatus, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'adharCardPic') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      const result = await dispatch(initiateSignup(formDataToSend));
      if (initiateSignup.fulfilled.match(result)) {
        setStep(2);
      }
    } else {
      if (signupData?.sellerId) {
        await dispatch(completeSignup({ sellerId: signupData.sellerId, otp }));
      } else {
        console.error("Seller ID not found");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">
          {step === 1 ? "Join Us!" : "Verify OTP"}
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                required
              />
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="adharCardPic"
                  className="flex flex-col items-center justify-center w-full h-24 border border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <p className="mb-2 text-sm text-gray-500">Upload Aadhar Card</p>
                    <p className="text-xs text-gray-500">(PNG, JPG or PDF)</p>
                  </div>
                  <input
                    id="adharCardPic"
                    type="file"
                    name="adharCardPic"
                    onChange={handleChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    required
                  />
                </label>
              </div>
            </>
          ) : (
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={signupStatus === "loading"}
          >
            {signupStatus === "loading"
              ? "Processing..."
              : step === 1
              ? "Create Account"
              : "Verify OTP"}
          </motion.button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/seller/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
