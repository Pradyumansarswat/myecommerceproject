import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/ordersdetails/${orderId}`
      );
      setOrderDetails(response.data.orders);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="text-center text-xl text-blue-600">Loading...</div>;
  }

  if (!orderDetails) {
    return (
      <div className="text-center text-xl text-red-500">Order not found.</div>
    );
  }

  const {
    products,
    deliveryAddress,
    status,
    cancelledReason,
    _id,
    totalAmount,
    userId,
  } = orderDetails;
  const { houseNumber, street, city, state, zipCode, country } =
    deliveryAddress;
  const { name, email, phone } = userId;

  const deliveryChargePercentage = 0.02;
  const productSubtotals = products.map((item) => {
    const subtotal = item.productId.sellPrice * item.quantity;
    return {
      name: item.productId.name,
      price: item.productId.sellPrice,
      quantity: item.quantity,
      subtotal: subtotal,
    };
  });

  const totalProductPrice = productSubtotals.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );

  const deliveryCharge = totalProductPrice * deliveryChargePercentage;
  const totalPayableAmount = totalProductPrice + deliveryCharge;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Order Details</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Go Home
        </button>
      </div>

      <div className="flex justify-between items-center py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700">Order ID: {_id}</h3>
        <p>
          Status:{" "}
          <span
            className={`px-3 py-1 rounded-full text-white ${
              status === "pending"
                ? "bg-yellow-500"
                : status === "cancelled"
                ? "bg-red-500"
                : "bg-green-500"
            }`}
          >
            {status}
          </span>
        </p>
      </div>
      {status === "cancelled" && cancelledReason && (
        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <h4 className="text-lg font-semibold">Cancellation Reason</h4>
          <p>{cancelledReason}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">User Information</h3>
        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Phone:</strong> {phone}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Ordered Products</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <div
              key={item._id}
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={`http://localhost:5000/${item.productId.images[0]}`}
                alt={item.productId.name}
                className="w-48 h-48 object-cover mb-4 rounded-md"
              />
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700">
                  {item.productId.name}
                </p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
                <p className="text-lg font-bold text-indigo-600">
                ${item.productId.sellPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Delivery Address</h3>
        <p>
          {houseNumber}, {street}, {city}, {state}, {zipCode}, {country}
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        <div className="space-y-4">
          <p>
            <strong>Total Items:</strong> {products.length}
          </p>
          <p>
            <strong>Total Price of Products:</strong> ${totalProductPrice}
          </p>
          <p>
            <strong>Delivery Charges (2%):</strong> ${deliveryCharge.toFixed(2)}
          </p>
          <p className="text-2xl font-bold text-gray-800">
            <strong>Total Payable Amount:</strong> $
            {totalPayableAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
