import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, getProductsByStatus } from "../../redux/slices/productSlice";
import { toast, Toaster } from "react-hot-toast";
import ProductStatus from "./ProductStatus";
import { CgDetailsLess } from "react-icons/cg";
import ViewProductDetail from "./ViewProductDetail";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaEllipsisV,
  FaEye,
} from "react-icons/fa";

const ProductData = () => {
  const dispatch = useDispatch();
  const { products, isLoading, isError, message, totalPages, currentPage } =
    useSelector((state) => state.product);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    if (filter) {
      dispatch(getProductsByStatus({ status: filter, page, limit }));
    } else {
      dispatch(getProducts({ page, limit }));
    }
  }, [dispatch, page, limit, filter]);

  if (isLoading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">Error: {message}</div>
    );
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); 
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
    setShowDetail(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const toggleDropdown = (productId) => {
    setActiveDropdown(activeDropdown === productId ? null : productId);
  };

  const ActionMenu = ({ product }) => (
    <div>
      <button
        onClick={() => toggleDropdown(product._id)}
        className="text-gray-500 hover:text-gray-700"
      >
        <FaEllipsisV />
      </button>
      {activeDropdown === product._id && (
        <div className="absolute xl:right-10 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleViewDetail(product)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEye className="mr-2" size={20} /> View Details
            </button>
            <ProductStatus
              status={product.status}
              id={product._id}
              productName={product.name}
            />
          </div>
        </div>
      )}
    </div>
  );


  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="relative w-full sm:w-auto">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm leading-5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Products</option>
              <option value="active">Active Products</option>
              <option value="pending">Pending Products</option>
              <option value="rejected">Rejected Products</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                        product.status
                      )}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sellerName} {/* Use sellerName consistently */}
                  </td>
                  <td className="px-6 py-4 relative whitespace-nowrap text-sm font-medium">
                    <ActionMenu product={product} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{currentPage}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {showDetail && selectedProduct && (
        <ViewProductDetail
          product={selectedProduct}
          onClose={() => setShowDetail(false)}
        />
      )}
      <Toaster />
    </div>
  );
};

export default ProductData;
