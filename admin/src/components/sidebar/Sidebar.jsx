import React, { useState } from "react";
import { ImHome } from "react-icons/im";
import { FaUsersCog, FaSellsy } from "react-icons/fa";
import { MdProductionQuantityLimits, MdCategory } from "react-icons/md";
import { FaFirstOrder } from "react-icons/fa6";

import { Link, Outlet, useLocation } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const dashBoardList = [
    {
      name: "Home",
      icon: <ImHome size={22} />,
      path: "/admin/dashboard",
      isActive: location.pathname === "/admin/dashboard",
    },
    {
      name: "Users",
      icon: <FaUsersCog size={25} />,
      path: "/admin/users",
      isActive: location.pathname === "/admin/users",
    },
    {
      name: "Sellers",
      icon: <FaSellsy size={25} />,
      path: "/admin/sellers",
      isActive: location.pathname === "/admin/sellers",
    },
    {
      name: "Products",
      icon: <MdProductionQuantityLimits size={25} />,
      path: "/admin/products",
      isActive: location.pathname === "/admin/products",
    },
    {
      name: "Categories",
      icon: <MdCategory size={25} />,
      path: "/admin/categories",
      isActive: location.pathname === "/admin/categories",
    },
    {
      name: "Orders",
      icon: <FaFirstOrder size={25} />,
      path: "/admin/orders",
      isActive: location.pathname === "/admin/orders",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <motion.div
        initial={{ width: "4rem" }}
        animate={{ width: isOpen ? "16rem" : "4rem" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-indigo-700 text-white flex flex-col"
      >
        <div className="p-4 flex justify-between items-center">
          {isOpen && <h2 className="text-2xl font-bold">Admin</h2>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-indigo-600 rounded-full"
          >
            <HiMenuAlt3 size={24} />
          </button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 p-2">
            {dashBoardList.map((item, index) => (
              <motion.li
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center p-2 rounded-md  transition-colors duration-200 ${
                    item.isActive
                      ? "bg-blue-50 text-blue-600 border-r-4 "
                      : "text-gray-200 hover:bg-gray-100 "
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </motion.div>
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Sidebar;
