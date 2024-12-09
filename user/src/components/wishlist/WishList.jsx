import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { fetchCartItems, fetchWishlistItems } from "../../store/userSlice";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const datawishlist = async () => {
    try {
      const item = await dispatch(fetchWishlistItems());
    } catch (error) {
      console.log(error);
    }
  };

  const datacart = async () => {
    try {
      const item = await dispatch(fetchCartItems());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    datawishlist();
    datacart();
  }, []);
  useEffect(() => {
    if (!token) {
      toast.error("Please sign up to view your wishlist.");
      setTimeout(() => {
        navigate("/signup");
      }, 2000);
    }
  }, [token, navigate]);

  let userId = null;
  try {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.userId;
  } catch (error) {
    console.error("Failed to decode token:", error);
  }

  const quantity = 1;

  const handleAddToCart = async (productId) => {
    try {
      await axios.post(`http://localhost:5000/api/cart/add`, {
        userId,
        productId,
        quantity,
      });
      datacart();
      toast.success("Item added to cart!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      toast.error("Failed to add product to cart.");
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    setItemToRemove(productId);
    setShowPopup(true);
  };

  const confirmRemove = async () => {
    try {
      await axios.post(`http://localhost:5000/api/wishlist/remove`, {
        userId,
        productId: itemToRemove,
      });

      fetchWishlistItems1();
      datawishlist();
      toast.success("Item removed from wishlist!");
    } catch (error) {
      console.error("Failed to remove product from wishlist:", error);
      toast.error("Failed to remove product from wishlist.");
    }
    setShowPopup(false);
  };

  const cancelRemove = () => {
    setShowPopup(false);
  };

  const fetchWishlistItems1 = async () => {
    if (!userId) {
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:5000/api/wishlist/${userId}`,
        {
          withCredentials: true,
        }
      );
      setWishlistItems(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch wishlist items:", error);
      toast.error("Failed to fetch wishlist items.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlistItems1();
      datawishlist();
    }
  }, [userId]);

  if (isLoading) return <p>Loading your wishlist...</p>;

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-page flex justify-center items-center p-6 bg-gray-100 min-h-screen">
        <ToastContainer />
        <div className="text-center">
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">
            Your Wishlist
          </h2>
          <p className="text-lg text-gray-500">
            Your wishlist is empty. Start adding items to your wishlist!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Your Wishlist
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item._id}
            className="wishlist-item bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition duration-300"
          >
            <img
              src={`http://localhost:5000/${item.images[0]}`}
              alt={item.name}
              className="wishlist-item-image w-full h-48 object-cover rounded-md mb-4"
            />
            <div className="wishlist-item-details mb-4">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm mb-2">
                Price:{" "}
                <span className="font-bold text-gray-800">
                  ${item.sellPrice}
                </span>
              </p>
              <p className="text-gray-600 text-sm">
                Description: {item.description}
              </p>
            </div>
            <div className="wishlist-item-actions flex justify-between gap-4">
              <button
                onClick={() => handleAddToCart(item._id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Add to Cart
              </button>
              <button
                onClick={() => handleRemoveFromWishlist(item._id)}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showPopup && (
        <div className="popup-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="popup bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <div className="flex justify-around gap-4">
              <button
                onClick={confirmRemove}
                className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={cancelRemove}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
