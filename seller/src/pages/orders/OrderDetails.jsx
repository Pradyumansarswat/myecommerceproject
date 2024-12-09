import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  const getOrder = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/orders/ordersdetails/${orderId}`
    );
    // console.log(response.data.order.userId);
    setOrder(response.data.orders);
  };
  useEffect(() => {
    getOrder();
  }, []);
  return (
    <>
      <div>
        <div>
          {order ? (
            <>
              <h2 className="text-3xl font-semibold mb-2 ">Order Details</h2>
              <div>
                <h3 className="text-3xl font-semibold mb-2 text-center">
                  User Details
                </h3>
                <div className="flex justify-evenly mt-2">
                  <p>
                    <span className="font-bold">Name</span>: {order.userId.name}
                  </p>
                  <p>
                    <span className="font-bold">Email</span>:{" "}
                    {order.userId.email}
                  </p>
                  <p>
                    <span className="font-bold">Phone</span>:{" "}
                    {order.userId.phone}
                  </p>
                </div>
              </div>

              <div className=" flex items-center justify-center my-4">
                <div className="flex items-center gap-2 pr-4">
                  <GoDotFill
                    className={` text-xl ${
                      order.status === "pending"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-xl font-semibold ${
                      order.status === "pending"
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  >
                    Order Placed
                  </p>
                </div>
                <div className="w-12 h-px bg-gray-400 mx-2"></div>
                <div className="flex items-center gap-2 pr-4">
                  <GoDotFill
                    className={` text-xl ${
                      order.status === "packed"
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-xl font-semibold ${
                      order.status === "packed"
                        ? "text-purple-500"
                        : "text-gray-500"
                    }`}
                  >
                    Order Packed
                  </p>
                </div>
                <div className="w-12 h-px bg-gray-400 mx-2"></div>
                <div className="flex items-center gap-2">
                  <GoDotFill
                    className={`text-xl ${
                      order.status === "shipped"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-xl font-semibold ${
                      order.status === "shipped"
                        ? "text-blue-500"
                        : "text-gray-500"
                    }`}
                  >
                    Order Shipped
                  </p>
                </div>
                <div className="w-12 h-px bg-gray-400 mx-2"></div>
                <div className="flex items-center gap-2">
                  <GoDotFill
                    className={`text-xl ${
                      order.status === "delivered"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-xl font-semibold ${
                      order.status === "delivered"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    Order Delivered
                  </p>
                </div>
                <div className="w-12 h-px bg-gray-400 mx-2"></div>
                <div className="flex items-center gap-2">
                  <GoDotFill
                    className={`text-xl ${
                      order.status === "cancelled"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                  <p
                    className={`text-xl font-semibold ${
                      order.status === "cancelled"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    Order Cancelled
                  </p>
                </div>
              </div>

              <h3 className="text-3xl font-semibold mb-2 text-center">
                Products
              </h3>
              <div className="my-2">
                {order.products && order.products.length > 0 ? (
                  order.products.map((product) => (
                    <div
                      key={product._id}
                      className="flex gap-2 mt-4 border-b-2 border-gray-300 pb-2"
                    >
                      <div className="w-1/2">
                        <h4 className="text-2xl font-semibold mb-2">
                          {product.productId.name}
                        </h4>
                        <p className="text-xl mb-2">
                          <span className="font-bold">Description</span>:{" "}
                          {product.productId.description}
                        </p>
                        <p className="text-xl mb-2">
                          <span className="font-bold">Sell Price</span>: $
                          {product.productId.sellPrice}
                        </p>
                        <p className="text-xl mb-2">
                          <span className="font-bold">Quantity</span>:{" "}
                          {product.quantity}
                        </p>
                        <p className="text-xl mb-2">
                          <span className="font-bold">Total</span>: $
                          {product.productId.sellPrice * product.quantity}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 w-1/2">
                        {product.productId.images.map((image, index) => (
                          <div key={index}>
                            <a
                              href={`http://localhost:5000/${image}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={`http://localhost:5000/${image}`}
                                alt={product.productId.description}
                                className="w-24 h-24 object-cover"
                              />
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No products found.</p>
                )}
              </div>
              <h3>Total Amount</h3>
              <p>
                Total Amount: $
                {order.products && order.products.length > 0
                  ? order.products.reduce(
                      (total, product) =>
                        total + product.productId.sellPrice * product.quantity,
                      0
                    )
                  : "0.00"}
              </p>
              <p>
                <span className="font-bold">Delivery Address</span>:
                {order.deliveryAddress
                  ? `${order.deliveryAddress.street}, ${order.deliveryAddress.houseNumber}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}, ${order.deliveryAddress.zipCode}, ${order.deliveryAddress.country}`
                  : "N/A"}
              </p>
            </>
          ) : (
            <p>Loading order details...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
