import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaToggleOn, FaToggleOff, FaUpload } from "react-icons/fa";

const CategoryPost = ({ onCategoryAdded, onClose }) => {
  const [category, setCategory] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) =>
    setCategory({ ...category, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setImageFile(e.target.files[0]);
  const handleStatusToggle = () =>
    setCategory((prev) => ({
      ...prev,
      status: prev.status === "active" ? "inactive" : "active",
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.name || !category.description || !imageFile) {
      toast.error("Please fill all fields and upload an image");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(category).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("image", imageFile);

      const { data } = await axios.post(
        "http://localhost:5000/api/categories",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(`Category ${category.name} added successfully`);
      onCategoryAdded(data.category);
      onClose();
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add category");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add New Category
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={category.name}
            onChange={handleChange}
            placeholder="Category Name"
          />
          <Input
            name="description"
            value={category.description}
            onChange={handleChange}
            placeholder="Description"
          />

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
          >
            <input
              type="file"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center cursor-pointer"
            >
              <FaUpload className="mr-2" />
              {imageFile ? imageFile.name : "Upload Image"}
            </label>
          </motion.div>

          <div className="flex items-center justify-between">
            <span>Status: {category.status}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleStatusToggle}
              className="text-2xl"
            >
              {category.status === "active" ? <FaToggleOn /> : <FaToggleOff />}
            </motion.button>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button onClick={onClose} className="bg-gray-300 hover:bg-gray-400">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Add Category
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const Input = ({ name, value, onChange, placeholder }) => (
  <motion.input
    whileFocus={{ scale: 1.02 }}
    type="text"
    name={name}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
  />
);

const Button = ({ children, className, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`px-4 py-2 rounded-md transition-colors ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default CategoryPost;
