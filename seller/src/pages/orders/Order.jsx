import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
const Order = () => {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [showModel, setShowModel] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [pageInput, setPageInput] = useState(currentPage);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const getOrders = async () => {
    const token = Cookies.get("token");
    const decoded = jwtDecode(token);
    const sellerId = decoded.sellerId;
    const response = await axios.get(
      `http://localhost:5000/api/orders/seller/${sellerId}`
    );
    setOrders(response.data.orders);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await axios.patch(`http://localhost:5000/api/orders/status/${orderId}`, {
      status: newStatus,
      cancelledReason: null,
    });
    getOrders();
  };

  const handleCancelOrder = async () => {
    await axios.patch(
      `http://localhost:5000/api/orders/status/${selectedOrderId}`,
      {
        status: "cancelled",
        cancelledReason: cancelReason,
      }
    );
    setShowCancelModal(false);
    getOrders();
  };

  const handleSearch = () => {
    const orderId = search.trim();
    if (orderId) {
      const filtered = orders.filter((order) => order._id.includes(orderId));
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  const handleSearchByDate = async () => {
    const token = Cookies.get("token");
    const decoded = jwtDecode(token);
    const sellerId = decoded.sellerId;
    const response = await axios.get(
      `http://localhost:5000/api/orders/seller/${sellerId}/date/${startDate}/${endDate}`
    );
    setFilteredOrders(response.data.orders);
  };

  const handleSearchByStatus = async (status) => {
    const token = Cookies.get("token");
    const decoded = jwtDecode(token);
    const sellerId = decoded.sellerId;
    if (status) {
      const response = await axios.get(
        `http://localhost:5000/api/orders/seller/${sellerId}/status/${status}`
      );
      setFilteredOrders(response.data.orders);
    } else {
      setFilteredOrders(orders);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const calculateTotalAmount = (products) => {
    return products.reduce((total, product) => {
      const sellPrice = parseFloat(product.productId.sellPrice) || 0;
      const quantity = parseInt(product.quantity, 10) || 0;

      return total + sellPrice * quantity;
    }, 0);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePageChange = () => {
    const pageNumber = Number(pageInput);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="sm:p-6">
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID"
            className="border border-gray-300 rounded p-2 w-full sm:w-1/4 mb-2 sm:mb-0"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Go
          </button>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full sm:w-1/4 mb-2 sm:mb-0"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full sm:w-1/4 mb-2 sm:mb-0"
          />
          <button
            onClick={handleSearchByDate}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Search by Date
          </button>
        </div>

        {showFilters && (
          <div className="absolute bg-white shadow-lg rounded p-4 z-10">
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => handleSearchByStatus("pending")}
                className="bg-yellow-500 text-white py-2 px-4 rounded"
              >
                Pending
              </button>
              <button
                onClick={() => handleSearchByStatus("delivered")}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Delivered
              </button>
              <button
                onClick={() => handleSearchByStatus("cancelled")}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancelled
              </button>
              <button
                onClick={() => handleSearchByStatus("shipped")}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Shipped
              </button>
              <button
                onClick={() => handleSearchByStatus("packed")}
                className="bg-purple-500 text-white py-2 px-4 rounded"
              >
                Packed
              </button>
              <button
                onClick={() => handleSearchByStatus("")}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                All Orders
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 ">
              {currentOrders.map((orderItem) => (
                <tr
                  key={orderItem._id}
                  className="hover:bg-gray-50 transition-colors duration-200 "
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {orderItem._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <img
                      src={`http://localhost:5000/${orderItem.products[0].productId.images[0]}`}
                      alt="product"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orderItem.products[0].productId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orderItem.userId.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${calculateTotalAmount(orderItem.products).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {orderItem.status === "pending" ? (
                      <span className="text-yellow-500">Pending</span>
                    ) : orderItem.status === "delivered" ? (
                      <span className="text-green-500">Delivered</span>
                    ) : orderItem.status === "cancelled" ? (
                      <span className="text-red-500">Cancelled</span>
                    ) : orderItem.status === "shipped" ? (
                      <span className="text-blue-500">Shipped</span>
                    ) : orderItem.status === "packed" ? (
                      <span className="text-purple-500">Packed</span>
                    ) : (
                      <span className="text-gray-500">Unknown</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div
                      onClick={() => {
                        setShowModel(
                          showModel === orderItem._id ? null : orderItem._id
                        );
                        setSelectedOrderId(orderItem._id);
                      }}
                    >
                      <BsThreeDotsVertical />
                    </div>
                    {showModel === orderItem._id && (
                      <div className="bg-gray-800 text-white absolute  right-4 mt-4 flex flex-col gap-2 p-4 rounded-md shadow-lg z-50">
                        <Link to={`/admin/orders/${orderItem._id}`}>
                          <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition duration-200">
                            View Details
                          </button>
                        </Link>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-indigo-500 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={indexOfLastOrder >= filteredOrders.length}
            className="bg-indigo-500 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="mt-4 flex items-center">
          <input
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            className="border border-gray-300 rounded p-2 w-20"
            min="1"
            max={totalPages}
          />
          <button
            onClick={handlePageChange}
            className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default Order;
