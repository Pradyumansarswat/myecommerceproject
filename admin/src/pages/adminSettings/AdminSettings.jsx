import React, { useState } from "react";
import AdminDetails from "../../components/adminData/AdminDetails";
import ShowDetail from "../../components/adminData/ShowDetail";
import ViewFullDetail from "../../components/adminData/ViewFullDetail";
import { GiCrossMark } from "react-icons/gi";

import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AdminSettings = () => {
  const [showAdminDetails, setShowAdminDetails] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);

  return (
    <div className="">
      <Outlet />
      <div className="fixed top-4 right-4 z-10">
        <ShowDetail setShowAdminDetails={setShowAdminDetails} />
      </div>
      <AnimatePresence>
        {showAdminDetails && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-64 bg-indigo-50 shadow-lg z-20"
          >
            <button
              onClick={() => setShowAdminDetails(false)}
              className="absolute top-3 right-2 text-2xl font-bold group bg-indigo-600 text-white rounded-md p-1 hover:bg-indigo-800"
            >
              <GiCrossMark className="group-hover:scale-150 transition-all duration-100" />
            </button>
            <AdminDetails setShowFullDetails={setShowFullDetails} />
          </motion.div>
        )}
      </AnimatePresence>
      {showFullDetails && <ViewFullDetail onClose={() => setShowFullDetails(false)} />}
    </div>
  );
};

export default AdminSettings;
