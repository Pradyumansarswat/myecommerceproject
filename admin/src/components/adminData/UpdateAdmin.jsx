import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { adminUpdateDetails } from '../../redux/slices/adminSlice';
import { FaSave, FaTimes, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const UpdateAdmin = ({ user, onCancel }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(adminUpdateDetails(formData));
    onCancel();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-indigo-700 mb-4">Edit Profile</h3>
      <div className="space-y-4">
        <div className="flex items-center bg-gray-100 p-3 rounded-lg transition-all duration-300 focus-within:bg-white focus-within:shadow-md">
          <FaUser className="text-indigo-500 mr-3"  />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-transparent w-full focus:outline-none"
            placeholder="Your Name"
          />
        </div>
        <div className="flex items-center bg-gray-100 p-3 rounded-lg transition-all duration-300 focus-within:bg-white focus-within:shadow-md">
          <FaEnvelope className="text-indigo-500 mr-3" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent w-full focus:outline-none"
            placeholder="Your Email"
          />
        </div>
        <div className="flex items-center bg-gray-100 p-3 rounded-lg transition-all duration-300 focus-within:bg-white focus-within:shadow-md">
          <FaPhone className="text-indigo-500 mr-3" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="bg-transparent w-full focus:outline-none"
            placeholder="Your Phone"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition-colors duration-300"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-300 flex items-center"
        >
          <FaSave className="mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default UpdateAdmin;
