import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../../redux/slices/userSlice";
import { toast, Toaster } from "react-hot-toast";
import UserStatus from "./UserStatus";
import { CgDetailsLess } from "react-icons/cg";
import ViewUserDetail from "./ViewUserDetail";
import {
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaEllipsisV,
  FaEye,
} from "react-icons/fa";

const UsersData = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const { users, isSuccess, isError, message, totalPages, currentPage } =
    useSelector((state) => state.user);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getUsers({ page, limit, status: filter, search: searchTerm }));
  }, [dispatch, page, limit, filter, searchTerm]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isSuccess, isError, message]);

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

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleViewDetail = (user) => {
    setSelectedUser(user);
    setShowDetail(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = (userId) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const ActionMenu = ({ user }) => (
    <div>
      <button
        onClick={() => toggleDropdown(user._id)}
        className="text-gray-500 hover:text-gray-700"
      >
        <FaEllipsisV />
      </button>
      {activeDropdown === user._id && (
        <div className="absolute xl:right-10  mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleViewDetail(user)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FaEye className="mr-2" size={20} /> View Details
            </button>
            <UserStatus
              status={user.status}
              id={user._id}
              userName={user.name}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className=" sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search users..."
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
              <option value="">All Users</option>
              <option value="active">Active Users</option>
              <option value="inactive">Inactive Users</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaChevronDown className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="sm:hidden space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white relative border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user.name}
                </h2>
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">{user.phone}</p>
              <p className="text-sm text-gray-600 mb-3">{user.email}</p>
              {/* <div className="flex justify-between items-center">
                <button
                  onClick={() => handleViewDetail(user)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  View Details
                </button>
                <UserStatus
                  status={user.status}
                  id={user._id}
                  userName={user.name}
                />
              </div> */}
              <ActionMenu user={user} />
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
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 relative whitespace-nowrap text-sm font-medium">
                    {/* <div className="flex items-center space-x-4">
                      <button onClick={() => setClickDots(!clickDots)}>
                        <TbDotsVertical size={20} />
                      </button>

                      { clickDots && (
                        <div className="flex items-center space-x-4 w-40 bg-white absolute justify-end">
                          <button
                          onClick={() => handleViewDetail(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          <CgDetailsLess size={20} />
                        </button>
                        <UserStatus
                            status={user.status}
                            id={user._id}
                            userName={user.name}
                          />
                        </div>
                      )}
                    </div> */}
                    <ActionMenu user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
            <div className="hidden sm:flex space-x-2">
              {generatePageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-1 border rounded-md text-sm font-medium ${
                    pageNum === parseInt(currentPage)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                  } transition-colors duration-200`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
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

      {showDetail && selectedUser && (
        <ViewUserDetail
          user={selectedUser}
          onClose={() => setShowDetail(false)}
        />
      )}
      <Toaster />
    </div>
  );
};

export default UsersData;
