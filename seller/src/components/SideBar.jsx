import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaBox, FaClipboardList, FaUser, FaCog, FaProductHunt , FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const navItems = [
  { to: "/seller/dashboard", icon: FaHome, text: "Dashboard" },
  { to: "/seller/products", icon: FaBox, text: "Products" },
  { to: "/seller/orders", icon: FaClipboardList, text: "Orders" },
  { to: "/seller/profile", icon: FaUser, text: "Profile" },
  { to: "/seller/settings", icon: FaCog, text: "Settings" },
  {to: "/seller/all-products", icon: FaProductHunt, text: "All Products"}
];

const SideBar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWide, setIsWide] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleWidth = () => setIsWide(!isWide);

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`bg-white text-gray-800 h-full ${
          isWide ? 'w-64' : 'w-20'
        } flex flex-col justify-between transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative md:translate-x-0 z-30 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {isWide && <h2 className="text-xl font-bold text-blue-600">Seller Hub</h2>}
            <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-blue-600">
              <FaBars size={24} />
            </button>
          </div>
          <nav className="flex-grow py-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                icon={<item.icon size={20} />}
                text={item.text}
                isWide={isWide}
                isActive={location.pathname === item.to}
              />
            ))}
          </nav>
          <button
            onClick={toggleWidth}
            className="hidden md:flex items-center justify-center w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 transition duration-200"
          >
            {isWide ? <FaChevronLeft size={16} /> : <FaChevronRight size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
          <button onClick={toggleSidebar} className="md:hidden text-gray-600 hover:text-blue-600">
            <FaBars size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div>{/* for future use */}</div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavLink = ({ to, icon, text, isWide, isActive }) => (
  <Link
    to={to}
    className={`flex items-center py-3 px-4 transition duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
        : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'
    } ${
      isWide ? 'justify-start' : 'justify-center'
    }`}
  >
    <span className={`${isWide ? 'mr-3' : ''}`}>{icon}</span>
    {isWide && <span className="font-medium">{text}</span>}
  </Link>
);

export default SideBar;
