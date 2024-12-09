import React, { useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { motion } from "framer-motion";

const ViewSellerDetail = ({ seller, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <motion.div
        ref={modalRef}
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
        <h1 className="text-2xl font-bold mb-6 text-center">Seller Details</h1>
        <div className="space-y-4 text-left">
          <DetailItem label="Name" value={seller?.name} />
          <DetailItem label="Email" value={seller?.email} />
          <DetailItem label="Phone" value={seller?.phone} />
          <DetailItem label="Adhar Card" value={seller?.adharCardPic} />
          <DetailItem label="Status" value={seller?.status} />
          <DetailItem
            label="Created At"
            value={seller?.createdAt
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("-")}
          />
          <DetailItem
            label="Last Update"
            value={seller?.updatedAt
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("-")}
          />
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

export default ViewSellerDetail;
