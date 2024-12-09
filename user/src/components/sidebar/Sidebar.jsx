import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul className="sidebar-menu">
        {categories.length > 0 ? (
          categories?.map((category) => (
            <li key={category._id}>
              <Link to={`product/${category._id}`}>
                {category.name}
              </Link>
            </li>
          ))
        ) : (
          <li>No categories available</li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
