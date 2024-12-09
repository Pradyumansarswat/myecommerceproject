import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProductsBySellerId } from "../../redux/slices/productSlice";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ViewSellerProduct = ({ sellerId }) => {
  const dispatch = useDispatch();
  const {
    sellerProducts,
    sellerProductsTotalPages,
    sellerProductsCurrentPage,
    isLoading,
  } = useSelector((state) => state.product);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    dispatch(getProductsBySellerId({ sellerId, page, limit }));
  }, [dispatch, sellerId, page, limit]);

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, sellerProductsTotalPages));
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="sm:p-6">
        {sellerProducts && sellerProducts.length > 0 ? (
          <>
            <div className="sm:hidden space-y-4">
              {sellerProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
                >
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">
                    Price: ${product.price}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Status: {product.status}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Category: {product.categoryName}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
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
                      Category
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sellerProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.categoryName}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">
                    {sellerProductsCurrentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {sellerProductsTotalPages}
                  </span>
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={sellerProductsCurrentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {sellerProductsCurrentPage} of {sellerProductsTotalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={
                    sellerProductsCurrentPage === sellerProductsTotalPages
                  }
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>No products found for this seller.</p>
        )}
      </div>
    </div>
  );
};

export default ViewSellerProduct;
