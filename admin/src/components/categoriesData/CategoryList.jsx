import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaEllipsisV, FaBoxOpen } from "react-icons/fa";
import { toast } from "react-hot-toast";
import StatusToggle from "./StatusToggle";
import DeleteCategory from "./DeleteCategory";
import { useNavigate } from "react-router-dom";

const CategoryList = ({ categories, setCategories, onUpdateCategory }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const url =
          activeFilter === "all"
            ? "http://localhost:5000/api/categories"
            : `http://localhost:5000/api/categories?status=${activeFilter}`;

        const response = await axios.get(url);
        setCategories(response.data.categories);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories");
        setLoading(false);
      }
    };
    fetchCategories();
  }, [setCategories, activeFilter]);

  const handleStatusToggle = async (category) => {
    const newStatus = category.status === "active" ? "inactive" : "active";
    try {
      const response = await axios.put(
        `http://localhost:5000/api/categories/${category._id}`,
        {
          ...category,
          status: newStatus,
        }
      );
      setCategories((prevCategories) =>
        prevCategories.map((cat) =>
          cat._id === category._id ? response.data.category : cat
        )
      );
      toast.success(`Category ${category.name} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating category status:", error);
      toast.error("Failed to update category status");
    }
  };

  const handleCategoryDeleted = (deletedCategoryId) => {
    setCategories((prevCategories) =>
      prevCategories.filter((cat) => cat._id !== deletedCategoryId)
    );
  };

  const toggleDropdown = (categoryId) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  if (loading) {
    return (
      <div className="text-center text-gray-600">Loading categories...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white shadow sm:rounded-lg relative">
      <div className="p-4 flex justify-end">
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Image
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <img
                  src={`http://localhost:5000/${category.image}`}
                  alt={category.name}
                  className="h-10 w-10 rounded-full"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    category.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {category.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium ">
                <button
                  onClick={() => toggleDropdown(category._id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaEllipsisV />
                </button>
                {activeDropdown === category._id && (
                  <div className="absolute right-10 mt-2 w-48 bg-white border-2 border-gray-300 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => onUpdateCategory(category)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FaEdit className="inline mr-2 align-text-bottom" /> Update
                      </button>
                      <button
                        onClick={() => navigate(`/admin/category-products/${category._id}`)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <FaBoxOpen className="inline mr-2 align-text-bottom" /> View Products
                      </button>
                      <button
                        onClick={() => handleStatusToggle(category)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <StatusToggle status={category.status} onToggle={() => {}} />
                        <span className="ml-2">
                          {category.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </button>
                      <DeleteCategory
                        category={category}
                        onCategoryDeleted={handleCategoryDeleted}
                      />
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;
