import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import {
  getSellerById,
  updateProfilePic,
  updateSellerDetails,
} from "../../redux/slices/sellerSlice";
import {
  FaUser,
  FaIdCard,
  FaCamera,
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaEdit,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const SellerDetails = () => {
  const dispatch = useDispatch();
  const { seller, token } = useSelector((state) => state.seller);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showAadhaarImage, setShowAadhaarImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: seller ? seller.name : '',
    email: seller ? seller.email : '',
    phone: seller ? seller.phone : '',
  });

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const sellerId =
          decodedToken.id || decodedToken.sellerId || decodedToken.sub;
        if (sellerId) {
          dispatch(getSellerById(sellerId));
        } else {
          console.error("No seller ID found in the token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (seller) {
      setUpdatedData({
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
      });
    }
  }, [seller]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("profilePic", selectedFile);
      try {
        const resultAction = await dispatch(updateProfilePic(formData));
        if (updateProfilePic.fulfilled.match(resultAction)) {
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
        } else {
          console.error(
            "Failed to upload profile picture:",
            resultAction.error
          );
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
      }
    } else {
      console.log("No file selected");
    }
  };

  const handleEditChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const resultAction = await dispatch(updateSellerDetails({ id: seller._id, updates: updatedData }));
    if (updateSellerDetails.fulfilled.match(resultAction)) {
      setIsEditing(false);
    } else {
      console.error("Failed to update seller details:", resultAction.error);
    }
  };

  if (!seller) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen text-2xl font-bold text-gray-600"
      >
        Loading seller details...
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-gray-100 min-h-screen flex justify-center items-start py-8"
    >
      <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative h-40 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="flex justify-center items-center h-full ">
            <h1 className="glow -translate-y-2">Welcome To Seller Hub</h1>
          </div>
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32">
              {seller.profilePic ? (
                <img
                  src={`http://localhost:5000/uploads/${seller.profilePic}`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center border-4 border-white shadow-lg">
                  <FaUser size={48} className="text-gray-400" />
                </div>
              )}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-white text-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-100 transition duration-300 shadow"
              >
                <FaCamera size={16} />
              </label>
              <input
                id="profile-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>
        </div>
        <div className="pt-20 px-6 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 uppercase text-center mb-4">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={updatedData.name}
                onChange={handleEditChange}
                className="border-b outline-none rounded p-1"
              />
            ) : (
              seller.name
            )}
            <button onClick={() => setIsEditing(!isEditing)} className="ml-2">
              <FaEdit />
            </button>
          </h2>
          <div className="space-y-2 flex flex-col justify-center items-start">
            <p className="text-gray-600 flex items-center justify-center">
              <FaEnvelope className="mr-2 text-purple-500" />
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={updatedData.email}
                  onChange={handleEditChange}
                  className="border-b w-full outline-none rounded p-1"
                />
              ) : (
                seller.email
              )}
            </p>
            <p className="text-gray-600 flex items-center justify-center">
              <FaPhone className="mr-2 text-purple-500" />
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={updatedData.phone}
                  onChange={handleEditChange}
                  className="border-b w-full outline-none rounded p-1"
                />
              ) : (
                seller.phone
              )}
            </p>
            {isEditing && (
              <button onClick={handleUpdate} className="mt-2 bg-blue-500 text-white rounded px-4 py-2">
                Save Changes
              </button>
            )}
          </div>
          {selectedFile && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              className="mt-6 w-full px-  4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 text-sm font-medium"
            >
              Upload New Picture
            </motion.button>
          )}
          {uploadSuccess && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-green-500 mt-2 text-sm text-center"
            >
              <FaCheck className="inline mr-1" /> Upload successful!
            </motion.p>
          )}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Aadhaar Card
            </h3>
            {seller.adharCardPic ? (
              <div className="relative h-48 overflow-y-auto custom-scrollbar">
                <img
                  src={`http://localhost:5000/${seller.adharCardPic}`}
                  alt="Aadhaar Card"
                  className="w-full object-contain cursor-pointer"
                  onClick={() => setShowAadhaarImage(true)}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <FaIdCard size={48} className="text-gray-400" />
              </div>
            )}
            <p className="mt-2 text-sm text-gray-500 text-center">
              Scroll to view full image or tap to enlarge
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showAadhaarImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowAadhaarImage(false)}
          >
            <div className="relative w-full h-full max-w-lg max-h-full m-4">
              <img
                src={`http://localhost:5000/${seller.adharCardPic}`}
                alt="Aadhaar Card"
                className="w-full h-full object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={() => setShowAadhaarImage(false)}
              >
                <FaTimes size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SellerDetails;
