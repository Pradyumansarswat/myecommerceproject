import React from "react";
import { IoSettingsOutline } from "react-icons/io5";

const ShowDetail = ({ setShowAdminDetails }) => {
  return (
    <button
      onClick={() => setShowAdminDetails(true)}
      className="custom-border-radius bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-full hover:bg-gray-700 transition-colors duration-200"
    >
      <IoSettingsOutline size={24} className="animate-spin " />
    </button>
  );
};

export default ShowDetail;
