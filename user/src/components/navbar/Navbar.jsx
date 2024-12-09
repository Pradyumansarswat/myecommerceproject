import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Sidebar from "../sidebar/Sidebar";
import { FaRegHeart } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  fetchWishlistItems,
  resetUserData,
  selectCartCount,
  selectWishlistCount,
} from "../../store/userSlice";

const Navbar = ({ onCategorySelect }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const wishlistCount = useSelector(selectWishlistCount);
  const cartCount = useSelector(selectCartCount);

  const token = Cookies.get("token");
  let userId;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  }

  useEffect(() => {
    const checkAuthToken = () => {
      const token = Cookies.get("token");
      setLoggedIn(!!token);
    };

    checkAuthToken();

    const intervalId = setInterval(checkAuthToken, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // profile pic

  const fetchUserProfile = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      const response = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );

      if (response.data?.profilePic) {
        setUserImage(
          `http://localhost:5000/uploads/${response.data.profilePic}`
        );
      } else {
        setUserImage(
          "https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
        );
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  // const fetchWishlistItems = async () => {
  //   try {
  //     if (!token) {
  //       throw new Error("No token found");
  //     }

  //     const response = await axios.get(
  //       `http://localhost:5000/api/wishlist/${userId}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setWishlistCount(response.data.products.length);
  //     // console.log(wishlistCount)
  //     // console.log(response.data.products.length)
  //   } catch (error) {
  //     console.error("Failed to fetch wishlist items:", error);
  //   }
  // };

  // const fetchCartItems = async () => {
  //   try {
  //     if (!token) {
  //       throw new Error("No token found");
  //     }

  //     const response = await axios.get(
  //       `http://localhost:5000/api/cart/${userId}`,
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     setCartCount(response.data.products.length);
  //     // console.log(setCartCount)
  //   } catch (error) {
  //     console.error("Failed to fetch cart items:", error);
  //   }
  // };

  // const dataGet = async () => {
  //   try {
  //     const item = await dispatch(fetchWishlistItems());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   dataGet();
  // }, []);

  // useEffect(() => {
  //   if (userId) {
  //     fetchUserProfile();
  //   }
  // }, [userId, token]);

  useEffect(() => {
    if (loggedIn && userId) {
      dispatch(fetchWishlistItems(userId));
      dispatch(fetchCartItems(userId)); 
      fetchUserProfile();
    } else {
      dispatch(resetUserData());
    }
  }, [loggedIn, userId, dispatch]);

  const handleLogout = () => {
    Cookies.remove("token");
    setLoggedIn(false);
    dispatch(resetUserData());
    setUserImage(null);

    navigate("/login");
  };

  const updateCounts = async () => {
    if (userId) {
      await dispatch(fetchWishlistItems(userId));
      await dispatch(fetchCartItems(userId));
    }
  };

  const handleAddToWishlist = async (productId) => {
    await axios.post(`http://localhost:5000/api/wishlist/add`, {
      userId,
      productId,
    });
    updateCounts();
  };

  const handleRemoveFromWishlist = async (productId) => {
    await axios.post(`http://localhost:5000/api/wishlist/remove/${productId}`, {
      data: { userId },
    });
    updateCounts();
  };

  const handleAddToCart = async (productId) => {
    await axios.post(`http://localhost:5000/api/cart/add`, {
      userId,
      productId,
    });
    updateCounts();
  };

  const handleRemoveFromCart = async (productId) => {
    await axios.post(`http://localhost:5000/api/cart/remove/${productId}`, {
      data: { userId },
    });
    updateCounts();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <button className="toggle-btn" onClick={toggleSidebar}>
              &#9776;
            </button>
            <span>ShopEase</span>
          </div>

          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {!loggedIn && (
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            )}
          </ul>

          <div className="navbar-icons">
            {/* <div className="search-box">
              <input type="text" placeholder="What are you looking for?" />
              <button type="submit">
                <CiSearch className="fa fa-search" />
              </button>
            </div> */}

            <Link to="/wishlist" className="icon">
              <FaRegHeart className="icon-style" />
              {wishlistCount > 0 && (
                <span className="icon-badge">{wishlistCount}</span>
              )}
            </Link>

            <Link to="/cart" className="icon">
              <LuShoppingCart className="icon-style" />
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </Link>

            {loggedIn && (
              <div className="user-account-dropdown">
                <button onClick={toggleDropdown}>
                  <img
                    // src="https://static.vecteezy.com/system/resources/previews/002/318/271/non_2x/user-profile-icon-free-vector.jpg"
                    src={userImage}
                    alt="User"
                    className="user-icon"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <Link to="/myaccount/profile">Manage My Account</Link>
                      </li>
                      <li>
                        <Link to="/myaccount/orders">My Orders</Link>
                      </li>
                      <li onClick={handleLogout}>Logout</li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <Sidebar isOpen={isSidebarOpen} onCategorySelect={onCategorySelect} />
      {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  );
};

export default Navbar;
