import React from "react";
import { useDispatch } from "react-redux";
import { updateSellerStatus } from "../../redux/slices/sellerSlice";
import { MdBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import { FaCheck } from "react-icons/fa";
import { toast } from "react-hot-toast";

const SellerStatus = ({ status, id, sellerName }) => {
  const dispatch = useDispatch();
  const handleStatus = async () => {
    let newStatus;
    if (status === "active") {
      newStatus = "inactive";
    } else if (status === "inactive") {
      newStatus = "active";
    } else if (status === "pending") {
      newStatus = "active";
    }

    try {
      await dispatch(updateSellerStatus({ sellerId: id, newStatus })).unwrap();
      toast.success(`Seller ${sellerName} ${newStatus} successfully`, {
        style: {
          border: "1px solid #000",
          padding: "16px",
          backgroundColor: "#000",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error(`Error updating status: ${error.message}`);
    }
  };
  return (
    <button
      onClick={handleStatus}
      title={
        status === "active"
          ? "Deactivate Seller"
          : status === "inactive"
          ? "Activate Seller"
          : "Approve Seller"
      }
      className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      {status === "active" ? (
        <MdBlock size={25} color="red" />
      ) : status === "inactive" ? (
        <CgUnblock size={25} color="green" />
      ) : (
        <FaCheck size={25} color="blue" />
      )}
      {status === "active"
        ? "inactive"
        : status === "inactive"
        ? "active"
        : "approved"}
    </button>
  );
};

export default SellerStatus;
