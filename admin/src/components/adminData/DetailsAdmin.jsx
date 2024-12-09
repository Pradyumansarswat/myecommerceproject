import React from 'react';
import { FaUserCog } from "react-icons/fa";

const DetailsAdmin = ({ setShowFullDetails }) => {
  return (
    <div className="mt-4">
      <button
        onClick={() => setShowFullDetails(true)}
        className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
      >
        <FaUserCog className="text-xl" />
        <span className="font-semibold">View Full Details</span>
      </button>
    </div>
  );
}

export default DetailsAdmin;
