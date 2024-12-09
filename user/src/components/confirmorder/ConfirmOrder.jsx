import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ConfirmOrder.css";

const ConfirmOrder = () => {
  const Id = useParams();
  const orderId = Id.orderId;
  //   console.log(id)
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const navigate = useNavigate();

  const res = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/orders/ordersdetails/${orderId}`
    );
    setOrderDetails(response.data.orders);
    console.log(response.data.orders._id);
  };

  useEffect(() => {
    res();
  }, [orderId]);

  const handleOrderClick = () => {
    setOrderPlaced(true);
  };

  const navigateToOrderDetails = () => {
    navigate(`/order-details/${orderId}`);
  };

  return (
    <div className="confirm-order">
      <h2 className="animate-text">Your Order Confirmed</h2>

      {orderDetails && (
        <div className="order-info">
          <p>
            <strong>Order ID:</strong> {orderDetails._id}
          </p>

          

          <button
            className="order-details-btn"
            onClick={navigateToOrderDetails}
          >
            Check Order Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmOrder;
