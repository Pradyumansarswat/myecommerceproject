import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../../redux/slices/adminSlice";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const VerifyOtp = ({ emailOrPhone }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(verifyOtp({ emailOrPhone, otp })).unwrap();
      toast.success("OTP verified successfully");
      Cookies.set('token', response.token);
      navigate("/admin/dashboard");
    } catch (error) {
      if (otp === "") {
        toast.error("OTP is required");
      } else {
        toast.error(error.message || "Cannot verify OTP");
      }
    }
  };

  return (
    <section>
      <Toaster />
      <div className="flex justify-center p-4 bg-white items-center h-screen">
        <div className="bg-gray-100 p-2 w-full md:w-1/2 xl:w-1/4 rounded-md shadow-md">
          <div className="">
            <h2 className="text-center text-2xl py-3 font-bold">Verify OTP</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col mb-4">
                <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">OTP</label>
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
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtp;
