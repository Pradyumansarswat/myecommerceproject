import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";

const LogOutAdmin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate("/admin/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center mt-3 space-x-2 text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors duration-200"
    >
      <FaSignOutAlt className="text-xl" />
      <span>Logout</span>
    </button>
  );
};

export default LogOutAdmin;
