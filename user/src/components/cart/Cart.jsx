import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "../../store/userSlice";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRemoveBtn, setShowRemoveBtn] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const datacart = async () => {
    try {
      const item = await dispatch(fetchCartItems());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    datacart();
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate("/signup");
      }
    } else {
      console.error("User is not logged in.");
      navigate("/signup");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/cart/${userId}`
          );
          setCartItems(response.data.products || []);
        } catch (error) {
          setError("Failed to fetch cart items. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCartItems();
  }, [userId]);

  const handleQuantityChange = async (productId, change) => {
    const updatedCart = cartItems.map((item) =>
      item.product._id === productId
        ? { ...item, quantity: item.quantity + change }
        : item
    );
    setCartItems(updatedCart);

    try {
      await axios.post(`http://localhost:5000/api/cart/add`, {
        userId,
        productId,
        quantity: change,
      });
    } catch (error) {
      console.error("Failed to update cart:", error);
    }
  };

  const handleRemoveFromCart = async () => {
    setCartItems(
      cartItems.filter((item) => item.product._id !== productToRemove)
    );

    try {
      await axios.post(`http://localhost:5000/api/cart/remove`, {
        userId,
        productId: productToRemove,
      });
      datacart();
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
    }
    setShowConfirmPopup(false);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.sellPrice * item.quantity,
    0
  );

  const deliveryCharges = (subtotal * 2) / 100;
  const totalAmount = subtotal + deliveryCharges;

  if (loading) return <p>Loading cart items...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg font-medium mb-4">
            No products available in your cart.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-600"
          >
            Add Products to Cart
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <table className="w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-4">Product</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Subtotal</th>
                  {showRemoveBtn && <th className="p-4">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.product._id} className="border-b">
                    <td className="p-4 flex items-center space-x-4">
                      <img
                        src={`http://localhost:5000/${item.product.images[0]}`}
                        alt={item.product.name}
                        className="w-16 h-16 rounded"
                      />
                      <p className="font-medium">{item.product.name}</p>
                    </td>
                    <td className="p-4">$ {item.product.sellPrice}</td>
                    <td className="p-4">
                      <select
                        className="border rounded px-2 py-1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.product._id,
                            parseInt(e.target.value) - item.quantity
                          )
                        }
                      >
                        {[...Array(10).keys()].map((n) => (
                          <option key={n + 1} value={n + 1}>
                            {n + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      $ {item.quantity * item.product.sellPrice}
                    </td>
                    {showRemoveBtn && (
                      <td className="p-4">
                        <button
                          onClick={() => {
                            setProductToRemove(item.product._id);
                            setShowConfirmPopup(true);
                          }}
                          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate("/")}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300"
              >
                Return To Shop
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300"
                onClick={() => setShowRemoveBtn((prev) => !prev)}
              >
                Update Cart
              </button>
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Cart Total</h3>
              <p className="flex justify-between mb-2">
                <span>Subtotal:</span> <span>$ {subtotal.toFixed(2)}</span>
              </p>
              <p className="flex justify-between mb-2">
                <span>Delivery Charges (2%):</span>{" "}
                <span>$ {deliveryCharges.toFixed(2)}</span>
              </p>
              <p className="flex justify-between mb-4 font-semibold">
                <span>Total:</span> <span>$ {totalAmount.toFixed(2)}</span>
              </p>
              <button
                className="w-full bg-red-500 text-white py-2 rounded shadow hover:bg-red-600"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-lg mb-4">
              Are you sure you want to remove this product from the cart?
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleRemoveFromCart}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
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

export default Cart;
