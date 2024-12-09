import React from "react";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
const ViewUserDetail = ({ user, onClose }) => {
  const [cartItem, setCartItem] = useState([]);
  useEffect(() => {
    const getCartItem = async () => {
      const userId = user._id;
      const response = await axios.get(
        `http://localhost:5000/api/cart/${userId}`
      );
      if (response.data) {
        setCartItem(response.data);
      }
      if (response.data === null || response.data === undefined) {
        setCartItem([]);
      }
    };
    getCartItem();
  }, []);
  console.log(cartItem);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoMdClose size={24} />
        </button>
        <h1 className="text-2xl font-bold mb-6 text-center">User Details</h1>
        <div className="space-y-4 text-left overflow-y-auto max-h-[500px]">
          <DetailItem label="Name" value={user?.name} />
          <DetailItem label="Email" value={user?.email} />
          <DetailItem label="Phone" value={user?.phone} />
          <DetailItem label="Status" value={user?.status} />
          <DetailItem
            label="Cart Item"
            value={
              cartItem?.products?.length > 0
                ? cartItem?.products?.length
                : "No Cart Item"
            }
          />

          <DetailItem
            label="Created At"
            value={user?.createdAt.slice(0, 10).split("-").reverse().join("-")}
          />
          <DetailItem
            label="Last Update"
            value={user?.updatedAt.slice(0, 10).split("-").reverse().join("-")}
          />
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-600">Cart Item</h2>
            <div className="flex justify-between text-sm ">
              <h1 className="bg-green-300 px-2 py-1 text-center rounded-md">Image</h1>
              <h1 className="bg-blue-200 px-2 py-1 text-center rounded-md">Name</h1>
              <h1 className="bg-sky-200 px-2 py-1 text-center rounded-md">Price</h1>
              <h1 className="bg-yellow-200 px-2 py-1 text-center rounded-md">Stock</h1>
            </div>
            {cartItem?.products?.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-2 border-b  space-y-2"
              >
                <img
                  src={`http://localhost:5000/${item?.product?.images[0]}`}
                  alt="product image"
                  className="w-10 h-10 object-cover"
                />
                <h1 title="product name">{item?.product?.name}</h1>
                <h1 title="product price">{item?.product?.sellPrice}</h1>
                <h1 title="product stock">{item?.product?.stock}</h1>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="border-b border-gray-200 pb-2">
    <h2 className="text-sm font-semibold text-gray-600">{label}</h2>
    <p className="text-base text-gray-800">{value}</p>
  </div>
);

export default ViewUserDetail;
