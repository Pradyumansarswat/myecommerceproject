import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./CheckOut.css";

import { useDispatch } from "react-redux";
import { resetCartCount } from "../../store/userSlice";




const CheckOut = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const dispatch = useDispatch();
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const navigate = useNavigate();
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;

  useEffect(() => {
    const fetchCartItems = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/cart/${userId}`
          );
          setCartItems(response.data.products);
          calculateTotal(response.data.products);
        } catch (error) {
          console.error("Failed to fetch cart items:", error);
        }
      }
    };

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/address/${userId}`
        );

        if (response.data && response.data.length > 0) {
          setAddresses(response.data);
          setSelectedAddress(response.data[0]._id); 
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchCartItems();
    fetchAddresses();
  }, [userId]);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce(
      (total, item) => total + item.product.sellPrice * item.quantity,
      0
    );
    const delivery = totalAmount * 0.02;
    setDeliveryCharge(delivery);
    setTotalPrice(totalAmount + delivery);
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (
      !newAddress.houseNumber ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.state ||
      !newAddress.zipCode ||
      !newAddress.country
    ) {
      setMessage("Please fill in all fields before adding an address.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/address`,
        { ...newAddress, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.address) {
        setAddresses((prevAddresses) => [
          ...prevAddresses,
          response.data.address,
        ]);
        setShowAddAddressForm(false);
        setNewAddress({
          houseNumber: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
        setMessage("New address added successfully.");
      } else {
        setMessage("Failed to add address. Please try again.");
      }
    } catch (error) {
      console.error("Failed to add address:", error);
      setMessage("Failed to add address. Please try again.");
    }
  };

  const handlePlaceOrder = () => {
    setShowPaymentForm(true);
  };

  const handleConfirmOrder = async () => {
    if (!selectedAddress || !paymentMethod) {
      setMessage("Please select an address and payment method.");
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        userId,
        deliveryAddress: selectedAddress,
        products: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      };

      const res = await axios.post(
        `http://localhost:5000/api/orders/create`,
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await axios.delete(`http://localhost:5000/api/cart/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage("Order placed and cart cleared successfully!");
      const orderId = res.data.order._id;
      setCartItems([]);
      setTotalPrice(0);
      dispatch(resetCartCount());

      navigate(`/confirm-order/${orderId}`);
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container max-w-7xl mx-auto py-10 px-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      
        <div className="cart-section bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>
          {cartItems.length === 0 ? (
            <p className="text-center text-xl">Your cart is empty.</p>
          ) : (
            <>
              <div className="cart-items space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="cart-item flex items-center bg-gray-100 p-4 rounded-md shadow-lg"
                  >
                    <img
                      src={`http://localhost:5000/${item.product.images[0]}`}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover mr-4 rounded-md"
                    />
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p>Price: ${item.product.sellPrice}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

       
        <div className="order-summary bg-white p-6 rounded-lg shadow-md">
          {!showPaymentForm ? (
            <>
              <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
              <div className="mb-4">
                <p>Total Product Price: ${(totalPrice - deliveryCharge).toFixed(2)}</p>
                <p>Delivery Charge (2%): ${deliveryCharge.toFixed(2)}</p>
                <p className="font-bold text-lg">Total Amount: ₹{totalPrice.toFixed(2)}</p>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
              {message && <p className="text-red-500 mt-4">{message}</p>}
            </>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold mb-6">Payment Details</h2>
          
              <h3 className="mb-2">Your Address</h3>
              {addresses.length > 0 ? (
                <div className="address-list mb-4">
                  {addresses.map((address) => (
                    <div key={address._id} className="flex items-center mb-3">
                      <input
                        type="radio"
                        id={address._id}
                        name="address"
                        checked={selectedAddress === address._id}
                        onChange={() => setSelectedAddress(address._id)}
                        className="mr-2"
                      />
                      <label htmlFor={address._id} className="cursor-pointer">
                        <p>{`${address.houseNumber}, ${address.street}`}</p>
                        <p>{`${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`}</p>
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No saved addresses. Please add one below.</p>
              )}

              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded-md mt-4"
              >
                {showAddAddressForm ? "Cancel" : "Add New Address"}
              </button>

              {showAddAddressForm && (
                <form onSubmit={handleAddAddress} className="mt-4 space-y-4">
                  <input
                    type="text"
                    placeholder="House No."
                    value={newAddress.houseNumber}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, houseNumber: e.target.value })
                    }
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Street"
                    value={newAddress.street}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, street: e.target.value })
                    }
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={newAddress.zipCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, zipCode: e.target.value })
                    }
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, country: e.target.value })
                    }
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition duration-300"
                  >
                    Save Address
                  </button>
                </form>
              )}
            </div>
          )}

        
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Select Payment Method</h3>
            <div className="payment-methods">
              <label>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit Card"
                  checked={paymentMethod === "Credit Card"}
                  onChange={() => setPaymentMethod("Credit Card")}
                  className="mr-2"
                />
                Credit Card
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={() => setPaymentMethod("PayPal")}
                  className="mr-2"
                />
                PayPal
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash On Delivery"
                  checked={paymentMethod === "PayPal"}
                  onChange={() => setPaymentMethod("COD")}
                  className="mr-2"
                />
                COD
              </label>
            </div>
          </div>

          <button
            onClick={handleConfirmOrder}
            className="bg-blue-500 text-white py-2 px-6 rounded-md mt-6 hover:bg-blue-600"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
