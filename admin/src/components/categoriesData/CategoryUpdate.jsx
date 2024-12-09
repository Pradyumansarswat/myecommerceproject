import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { motion } from "framer-motion";

const CategoryUpdate = ({ category, onCategoryUpdated, onClose }) => {
  const [updatedCategory, setUpdatedCategory] = useState(category);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setUpdatedCategory({ ...updatedCategory, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setErrors({ ...errors, image: "" });
  };

  const handleStatusToggle = () => {
    setUpdatedCategory(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    ["name", "description"].forEach(key => {
      if (!updatedCategory[key]) newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
    });

    if (!imageFile && !updatedCategory.image) {
      newErrors.image = "Image is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', updatedCategory.name);
      formData.append('description', updatedCategory.description);
      formData.append('status', updatedCategory.status);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await axios.put(`http://localhost:5000/api/categories/${category._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success(`Category ${updatedCategory.name} updated successfully`);
      onCategoryUpdated(response.data.category);
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Update Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DetailItem
            label="Name"
            value={updatedCategory.name}
            name="name"
            onChange={handleChange}
            error={errors.name}
          />
          <DetailItem
            label="Description"
            value={updatedCategory.description}
            name="description"
            onChange={handleChange}
            error={errors.description}
          />
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-sm font-semibold text-gray-600">Image</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1 text-base text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          </div>
          <div className="border-b border-gray-200 pb-2">
            <h2 className="text-sm font-semibold text-gray-600">Status</h2>
            <div className="flex items-center mt-1">
              <button 
                type="button" 
                onClick={handleStatusToggle}
                className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
              >
                {updatedCategory.status === 'active' ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
              </button>
              <span className="ml-2 text-sm text-gray-600">{updatedCategory.status}</span>
            </div>
          </div>
          <DetailItem
            label="Created At"
            value={new Date(category.createdAt).toLocaleString()}
            readOnly
          />
          <DetailItem
            label="Updated At"
            value={new Date(category.updatedAt).toLocaleString()}
            readOnly
          />
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Update Category
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ label, value, name, onChange, error, readOnly }) => (
  <div className="border-b border-gray-200 pb-2">
    <h2 className="text-sm font-semibold text-gray-600">{label}</h2>
    {readOnly ? (
      <p className="text-base text-gray-800">{value}</p>
    ) : (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full mt-1 text-base text-gray-800 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      />
    )}
    {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
  </div>
);

export default CategoryUpdate;
